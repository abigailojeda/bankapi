import dbConnection from '../database/db_connection.js';

class UserModel {

    static async getUsers() {
        const query = 'SELECT * FROM users';
        const response = await dbConnection.query(query);
        return response.rows;
    }

    static async getUserById(id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const response = await dbConnection.query(query, [id]);
        return response.rows[0];
    }
}

export default UserModel;