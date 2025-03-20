import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer, gql } from 'apollo-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { makeExecutableSchema } from '@graphql-tools/schema';

import UserModel from './models/user.model.js';
import AccountModel from './models/account.model.js';
import TransactionModel from './models/transaction.model.js';

import { transactionTypeDefs, createTransactionResolvers } from './graphql/transaction.schema.js';
import { accountTypeDefs, accountResolvers } from './graphql/account.schema.js';
import { cardTypeDefs, cardResolvers } from './graphql/card.schema.js';

import { createUserRouter } from './routes/user.router.js';
import { createAccountRouter } from './routes/account.router.js';
import { createTransactionRouter } from './routes/transaction.router.js';

const pubsub = new PubSub();
console.log(pubsub.asyncIterableIterator);
const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', createUserRouter({ UserModel }));
app.use('/accounts', createAccountRouter({ AccountModel }));
app.use('/transactions', createTransactionRouter({ TransactionModel }));

const rootTypeDefs = gql`
  type Query {
    hello: String
  }

  type Subscription {
    # Move root-level subscriptions here, or merge them from your other files:
    transactionAdded: Transaction
  }
`;

const rootResolvers = {
  Query: {
    hello: () => 'Hello World from Bank Api Apollo!',
  },
};

const typeDefs = [
  rootTypeDefs,
  transactionTypeDefs,
  cardTypeDefs,
  accountTypeDefs,
];
const resolvers = [
  rootResolvers,
  createTransactionResolvers(pubsub),
  cardResolvers,
  accountResolvers,
];

const schema = makeExecutableSchema({ typeDefs, resolvers });

async function startApolloServer() {
  const server = new ApolloServer({ schema });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const httpServer = http.createServer(app);

  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: () => {
        console.log('WebSocket connected for subscriptions');
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected from subscriptions');
      },
    },
    {
      server: httpServer,
      path: '/graphql',
    }
  );

  const PORT = process.env.PORT || 7000;
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint available at /graphql`);
    console.log(`Subscriptions available at /graphql`);
  });
}

startApolloServer().catch((error) => {
  console.error('Error starting Apollo Server:', error);
});
