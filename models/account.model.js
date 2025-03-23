import dbConnection from '../database/db_connection.js';

class AccountModel {
    
    static async getAccounts() {
        const query = 'SELECT * FROM accounts_data';
        const response = await dbConnection.query(query);
        return response.rows;
    }

    static async getAccountById(id) {
        const query = 'SELECT * FROM accounts_data WHERE id = $1';
        const response = await dbConnection.query(query, [id]);
        return response.rows[0];
    }

    static async getAccountsByUserId(userId) {
        const query = 'SELECT * FROM accounts_data WHERE user_id = $1';
        const response = await dbConnection.query(query, [userId]);
        return response.rows;
    }

    static async updateBalance(id, account) {
        const { current_balance } = account;
        const query = 'UPDATE accounts_data SET current_balance = $1 WHERE id = $2 RETURNING *';
        const response = await dbConnection.query(query, [current_balance, id]);
        return response.rows[0];
    }

    static async updateCurrency(id, currency, current_balance) {
        const query = 'UPDATE accounts_data SET currency = $1, current_balance = $2 WHERE id = $3 RETURNING *';
        const response = await dbConnection.query(query, [currency, current_balance, id]);
        return response.rows[0];
    }
}

export default AccountModel;