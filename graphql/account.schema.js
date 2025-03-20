import { gql } from 'apollo-server-express';
import AccountModel from '../models/account.model.js';

export const accountTypeDefs = gql`
type Account {
    id: ID!
    user_id: ID!
    iban: String
    currency: String
    current_balance: Float!
}

type Query {
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
    ): Account!
}
`;

export const accountResolvers = {
    Query: {
        // Usa el método getAccounts() de tu AccountModel
        accounts: async () => {
            return AccountModel.getAccounts();
        },

        // Usa el método getAccountById(id)
        account: async (_, { id }) => {
            return AccountModel.getAccountById(id);
        },

        // Usa el método getAccountsByUserId(userId)
        accountsByUserId: async (_, { userId }) => {
            return AccountModel.getAccountsByUserId(userId);
        },
    },

    Mutation: {
        // Usa el método updateBalance(id, account)
        updateBalance: async (_, { id, account }) => {
            return AccountModel.updateBalance(id, account);
        },

        // Usa el método updateCurrency(id, account)
        updateCurrency: async (_, { id, account }) => {
            return AccountModel.updateCurrency(id, account);
        },
    },

};