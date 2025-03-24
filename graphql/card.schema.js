import { gql } from 'apollo-server-express';
import CardModel from '../models/card.model.js';

const CARD_CHANGED = 'CARD_CHANGED';

export const cardTypeDefs = gql`
    enum CardChangeType {
        CREATED
        UPDATED
        DELETED
    }

    type Card {
        id: ID!
        account_id: ID!
        card_number: String!
    }

    type CardChangePayload {
        changeType: CardChangeType!
        card: Card
        deletedCardId: ID
    }

    type Query {
        cards: [Card!]!
        card(id: ID!): Card
        cardsByAccountId(account_id: ID!): [Card!]!
    }

    type Mutation {
        createCard(
            account_id: ID!
            card_number: String!
        ): Card!

        updateCard(
            id: ID!
            account_id: ID
            card_number: String
        ): Card!

        deleteCard(id: ID!): Boolean!
    }

    type Subscription {
        cardChanged: CardChangePayload!
    }
`;

export function createCardResolvers(pubsub) {
    return {
        Query: {
            cards: async () => {
                return CardModel.getCards();
            },
            card: async (_, { id }) => {
                return CardModel.getCardById(id);
            },
            cardsByAccountId: async (_, { account_id }) => {
                return CardModel.getCardsByAccountId(account_id);
            },
        },
        Mutation: {
            createCard: async (_, { account_id, card_number }) => {
                const cardData = { account_id, card_number };
                const newCard = await CardModel.createCard(cardData);
                pubsub.publish(CARD_CHANGED, {
                    cardChanged: {
                        changeType: 'CREATED',
                        card: newCard,
                    }
                });
                return newCard;
            },
            updateCard: async (_, { id, account_id, card_number }) => {
                const cardData = { account_id, card_number };
                const updatedCard = await CardModel.updateCard(id, cardData);
                pubsub.publish(CARD_CHANGED, {
                    cardChanged: {
                        changeType: 'UPDATED',
                        card: updatedCard,
                    }
                });
                return updatedCard;
            },
            deleteCard: async (_, { id }) => {
                const result = await CardModel.deleteCard(id);
                if (result) {
                    pubsub.publish(CARD_CHANGED, {
                        cardChanged: {
                            changeType: 'DELETED',
                            deletedCardId: id,
                        }
                    });
                }
                return result;
            },
        },
        Subscription: {
            cardChanged: {
                subscribe: () => pubsub.asyncIterableIterator(CARD_CHANGED),
            },
        },
    };
}