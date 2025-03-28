import { gql } from 'apollo-server-express';
import TransactionModel from '../models/transaction.model.js';
import AccountModel from '../models/account.model.js';

const TRANSACTION_CHANGED = 'TRANSACTION_CHANGED';

export const transactionTypeDefs = gql`
  enum TransactionChangeType {
    CREATED
    UPDATED
    VOIDED
    UNDONE
  }

  type Transaction {
    id: ID!
    account_id: ID!
    amount: Float!
    date: String
    type: String
    description: String
    currency: String
    updatedBalance: Float
    current_balance: Float
  }

  type TransactionChangePayload {
    changeType: TransactionChangeType!
    transaction: Transaction
    deletedTransactionId: ID
  }

  extend type Query {
    transactions: [Transaction!]!

    transaction(id: ID!): Transaction

    transactionsByAccountId(accountId: ID!): [Transaction!]!
  }

  extend type Mutation {
    createTransaction(
      accountId: ID!
      amount: Float!
      date: String
      type: String
      description: String
    ): Transaction!

    updateTransaction(
      id: ID!
      accountId: ID
      amount: Float
      date: String
      type: String
      description: String
      currency: String
    ): Transaction!

    undoTransaction(id: ID!): Transaction!

    voidTransaction(id: ID!): Transaction!
  }

  extend type Subscription {
    transactionChanged: TransactionChangePayload!
  }
`;

export function createTransactionResolvers(pubsub) {
  return {
    Query: {
      transactions: async () => {
        return TransactionModel.getNotVoidedTransactions();
      },
      transaction: async (_, { id }) => {
        return TransactionModel.getTransactionById(id);
      },
      transactionsByAccountId: async (_, { accountId }) => {
        return TransactionModel.getTransactionsByAccountId(accountId);
      },
    },

    Mutation: {
      createTransaction: async (
        _,
        { accountId, amount, date, type, description }
      ) => {
        const account = await AccountModel.getAccountById(accountId);
        
        const newTx = {
          account_id: accountId,
          amount,
          date,
          type,
          description,
          currency: account.currency,
        };

        let newBalance;

        if (type === 'deposit')
          newBalance = account.current_balance + amount;
        else if (type === 'withdrawal')
          newBalance = account.current_balance - amount;
        else
          throw new Error('Invalid transaction type');

        const createdTx = await TransactionModel.createTransaction(newTx, newBalance);
        
        const updatedAccount = await AccountModel.updateBalance(accountId, {
          current_balance: newBalance,
        });

        const resultTx = { ...createdTx, updatedBalance: updatedAccount.current_balance };

        pubsub.publish(TRANSACTION_CHANGED, {
          transactionChanged: {
            changeType: 'CREATED',
            transaction: resultTx,
          },
        });
        return resultTx;
      },

      updateTransaction: async (_, { id, accountId, amount, date, type, description, currency }) => {
        const oldTx = await TransactionModel.getTransactionById(id);
        if (!oldTx) throw new Error("Transaction not found");
      
        const effectiveNewAmount = type === 'deposit' ? Number(amount) : -Number(amount);
        const effectiveOldAmount = oldTx.type === 'deposit' ? Number(oldTx.amount) : -Number(oldTx.amount);
        const amountDiff = effectiveNewAmount - effectiveOldAmount;
        console.log("Effective new amount:", effectiveNewAmount, "Effective old amount:", effectiveOldAmount, "Diff:", amountDiff);
      
        const updatedTx = await TransactionModel.updateTransaction(id, {
          account_id: accountId || oldTx.account_id,
          amount: Number(amount),
          date,
          type,
          description,
          currency: currency || oldTx.currency,
        });
      
        const account = await AccountModel.getAccountById(updatedTx.account_id);
        const newBalance = account.current_balance + amountDiff;
        await AccountModel.updateBalance(updatedTx.account_id, { current_balance: newBalance });
      
        const resultTx = { ...updatedTx, updatedBalance: newBalance };
        pubsub.publish(TRANSACTION_CHANGED, {
          transactionChanged: {
            changeType: 'UPDATED',
            transaction: resultTx,
          },
        });
        return resultTx;
      },

      voidTransaction: async (_, { id }) => {
        const tx = await TransactionModel.getTransactionById(id);
        if (!tx) throw new Error("Transaction not found");

        if (!tx.voided) {
          const account = await AccountModel.getAccountById(tx.account_id);
          const newBalance = account.current_balance;
          const voidedTx = { ...tx, voided: true };
          await TransactionModel.updateTransaction(id, voidedTx);
          const resultTx = { ...voidedTx, updatedBalance: newBalance };

          pubsub.publish(TRANSACTION_CHANGED, {
            transactionChanged: {
              changeType: 'VOIDED',
              transaction: resultTx,
            },
          });
          return resultTx;
        }
        return tx;
      },

      undoTransaction: async (_, { id }) => {
        const originalTx = await TransactionModel.getTransactionById(id);
        if (!originalTx) throw new Error("Transaction not found");
      
        const updatedTxData = {
          ...originalTx,
          type: 'reversal',
          amount: originalTx.type === 'withdrawal' ? -originalTx.amount : originalTx.amount
        };
      
        const reversedTx = await TransactionModel.updateTransaction(id, updatedTxData);
        
        const account = await AccountModel.getAccountById(originalTx.account_id);
        const newBalance = originalTx.type === 'withdrawal' ? account.current_balance + originalTx.amount: account.current_balance - originalTx.amount;
        await AccountModel.updateBalance(originalTx.account_id, {
          current_balance: newBalance,
        });
        
        const resultTx = { ...reversedTx, updatedBalance: newBalance };

        pubsub.publish(TRANSACTION_CHANGED, {
          transactionChanged: {
            changeType: 'UNDONE',
            transaction: resultTx,
          },
        });
        return resultTx;
      }
    },

    Subscription: {
      transactionChanged: {
        subscribe: () => pubsub.asyncIterableIterator([TRANSACTION_CHANGED]),
      },
    },
  };
}