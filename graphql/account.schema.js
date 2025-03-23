import { gql } from 'apollo-server-express';
import AccountModel from '../models/account.model.js';

const CURRENCY_CHANGED = 'CURRENCY_CHANGED';

export const accountTypeDefs = gql`
type Account {
    id: ID!
    user_id: ID!
    iban: String
    currency: String
    current_balance: Float!
}

type CurrencyChangePayload {
    id: ID!
    currency: String!
}

extend type Query {
    # Devuelve todas las cuentas de la tabla
    accounts: [Account!]!

    # Devuelve una cuenta por ID
    account(id: ID!): Account

    # Devuelve todas las cuentas de un usuario concreto
    accountsByUserId(userId: ID!): [Account!]!
}

type Mutation {
    # Actualizar el saldo de una cuenta
    updateBalance(
        id: ID!
        current_balance: Float!
    ): Account!

    # Actualizar la moneda de una cuenta
    updateCurrency(
        id: ID!
        currency: String!
        current_balance: Float!
    ): Account!

}

type Subscription {
    currencyChanged: CurrencyChangePayload!
}
`;

export function createAccountResolvers(pubsub) {
    return {
        Query: {
            accounts: async () => {
                return AccountModel.getAccounts();
            },

            account: async (_, { id }) => {
                return AccountModel.getAccountById(id);
            },

            accountsByUserId: async (_, { userId }) => {
                return AccountModel.getAccountsByUserId(userId);
            },
        },

        Mutation: {
            updateCurrency: async (_, { id, currency, current_balance }) => {
                const updatedAccount = await AccountModel.updateCurrency(id, currency.toUpperCase(), current_balance);
                const response = { id, currency: updatedAccount.currency, current_balance: updatedAccount.current_balance };
                
                pubsub.publish(CURRENCY_CHANGED, {
                    currencyChanged: response,
                });

                return response;
            },
        },
        Subscription: {
            currencyChanged: {
              subscribe: () => pubsub.asyncIterableIterator(CURRENCY_CHANGED),
            },
          },
    };
}