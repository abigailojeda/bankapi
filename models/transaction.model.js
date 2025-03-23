import dbConnection from '../database/db_connection.js';

class TransactionModel {
    
    static async getTransactions() {
        const query = 'SELECT * FROM transactions';
        const response = await dbConnection.query(query);
        return response.rows;
    }

    static async getNotVoidedTransactions() {
        const query = 'SELECT * FROM transactions WHERE voided = false';
        const response = await dbConnection.query(query);
        return response.rows;
    }

    static async getTransactionById(id) {
        const query = 'SELECT * FROM transactions WHERE id = $1';
        const response = await dbConnection.query(query, [id]);
        return response.rows[0];
    }

    static async getTransactionsByAccountId(accountId) {
        const query = 'SELECT * FROM transactions WHERE account_id = $1';
        const response = await dbConnection.query(query, [accountId]);
        return response.rows;
    }

    static async createTransaction(transaction, newBalance) {
        const { account_id, date, amount, type, description, currency } = transaction;
        const query = 'INSERT INTO transactions (account_id, date, amount, type, description, currency, current_balance) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
        const response = await dbConnection.query(query, [account_id, date, amount, type, description, currency, newBalance]);
        return response.rows[0];
    }

    static async updateTransaction(id, transaction) {
        const { account_id, date, amount, type, description, currency } = transaction;
        const query = 'UPDATE transactions SET account_id = $1, date = $2, amount = $3, type = $4, description = $5, currency = $6 WHERE id = $7 RETURNING *';
        const response = await dbConnection.query(query, [account_id, date, amount, type, description, currency, id]);
        return response.rows[0];
    }

    static async deleteTransaction(id) {
        const query = 'DELETE FROM transactions WHERE id = $1';
        await dbConnection.query(query, [id]);
    }
}

export default TransactionModel;