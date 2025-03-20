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
        cardsByAccountId(accountId: ID!): [Card!]!
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
        // Usa el método getCards() de tu CardModel
        cards: async () => {
            return CardModel.getCards();
        },

        // Usa el método getCardById(id)
        card: async (_, { id }) => {
            return CardModel.getCardById(id);
        },

        // Usa el método getCardsByAccountId(accountId)
        cardsByAccountId: async (_, { accountId }) => {
            return CardModel.getCardsByAccountId(accountId);
        },
    },
 Mutation: {
        // Usa el método createCard(card)
        createCard: async (_, { account_id, card_number }) => {
            const card = { account_id, card_number };
            return CardModel.createCard(card);
        },

        // Usa el método updateCard(id, card)
        updateCard: async (_, { id, account_id, card_number }) => {
            const card = { account_id, card_number };
            return CardModel.updateCard(id, card);
        },

        // Usa el método deleteCard(id)
        deleteCard: async (_, { id }) => {
            return CardModel.deleteCard(id);
        },
    },

};