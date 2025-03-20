import dbConnection from '../database/db_connection.js';

class CardModel {

    static async getCards() {
        const query = 'SELECT * FROM cards';
        const response = await dbConnection.query(query);
        return response.rows;
    }

    static async getCardById(id) {
        const query = 'SELECT * FROM cards WHERE id = $1';
        const response = await dbConnection.query(query, [id]);
        return response.rows[0];
    }

    static async getCardsByAccountId(accountId) {
        const query = 'SELECT * FROM cards WHERE account_id = $1';
        const response = await dbConnection.query(query, [accountId]);
        return response.rows;
    }

    static async createCard(card) {
        const { account_id, card_number } = card;
        const query = 'INSERT INTO cards (account_id, card_number) VALUES ($1, $2) RETURNING *';
        const response = await dbConnection.query(query, [account_id, card_number]);
        return response.rows[0];
    }

    static async updateCard(id, card) {
        const { account_id, card_number } = card;
        const query = 'UPDATE cards SET account_id = $1, card_number = $2 WHERE id = $3 RETURNING *';
        const response = await dbConnection.query(query, [account_id, card_number, id]);
        return response.rows[0];
    }

    static async deleteCard(id) {
        const query = 'DELETE FROM cards WHERE id = $1';
        await dbConnection.query(query, [id]);
    }

}

export default CardModel;