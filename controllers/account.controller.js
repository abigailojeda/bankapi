class AccountController {
    
    constructor({ AccountModel }) {
        this.accountModel = AccountModel;
    }

    async getAccounts(req, res) {
        try {
            const accounts = await this.accountModel.getAccounts();
            return res.status(200).json(accounts);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAccountById(req, res) {
        try {
            const id = req.params.id;
            const account = await this.accountModel.getAccountById(id);
            return res.status(200).json(account);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAccountsByUserId(req, res) {
        try {
            const userId = req.params.userId;
            const accounts = await this.accountModel.getAccountsByUserId(userId);
            return res.status(200).json(accounts);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateBalance(req, res) {
        try {
            const id = req.params.id;
            const account = req.body;
            const updatedAccount = await this.accountModel.updateBalance(id, account);
            return res.status(200).json(updatedAccount);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateCurrency(req, res) {
        try {
            const id = req.params.id;
            const account = req.body;
            const updatedAccount = await this.accountModel.updateCurrency(id, account);
            return res.status(200).json(updatedAccount);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default AccountController;