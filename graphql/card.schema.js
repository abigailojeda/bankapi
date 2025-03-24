import { gql } from 'apollo-server-express';
import CardModel from '../models/card.model.js';

export const cardTypeDefs = gql`
 type Card {
    id: ID!
    account_id: ID!
    card_number: String!
     }

    type Query {
        # Devuelve todas las tarjetas de la tabla
        cards: [Card!]!

        # Devuelve una tarjeta por ID
        card(id: ID!): Card

        # Devuelve todas las tarjetas de una cuenta concreta
        cardsByAccountId(account_id: ID!): [Card!]!
    }

    type Mutation {
        # Crear una tarjeta
        createCard(
            account_id: ID!
            card_number: String!
        ): Card!

        # Actualizar una tarjeta
        updateCard(
            id: ID!
            account_id: ID
            card_number: String
        ): Card!

        # Eliminar una tarjeta
        deleteCard(id: ID!): Boolean!
    }

`;

export const cardResolvers = {
    Query: {
        cards: async () => {
            return CardModel.getCards();
        },

        card: async (_, { id }) => {
            return CardModel.getCardById(id);
        },

        cardsByAccountId: async (_, { accountId }) => {
            return CardModel.getCardsByAccountId(accountId);
        },
    },
 Mutation: {
        createCard: async (_, { account_id, card_number }) => {
            const card = { account_id, card_number };
            return CardModel.createCard(card);
        },

        updateCard: async (_, { id, account_id, card_number }) => {
            const card = { account_id, card_number };
            return CardModel.updateCard(id, card);
        },

        deleteCard: async (_, { id }) => {
            return CardModel.deleteCard(id);
        },
    },

};