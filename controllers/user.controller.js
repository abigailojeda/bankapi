class UserController {

    constructor({ UserModel }) {
        this.userModel = UserModel;
    }

    async getUsers(req, res) {
        try {
            const users = await this.userModel.getUsers();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getUserById(req, res) {
        try {
            const id = req.params.id;
            const user = await this.userModel.getUserById(id);
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default UserController;