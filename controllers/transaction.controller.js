class TransactionController {
    
    constructor({ TransactionModel }) {
        this.transactionModel = TransactionModel;
    }

    async geTransactions(req, res) {
        try {
            const ransaction = await this.transactionModel.geTransactions();
            return res.status(200).json(ransaction);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getTransactionById(req, res) {
        try {
            const id = req.params.id;
            const transaction = await this.transactionModel.getTransactionById(id);
            return res.status(200).json(transaction);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getTransactionsByAccountId(req, res) {
        try {
            const accountId = req.params.accountId;
            const transactions = await this.transactionModel.getTransactionsByAccountId(accountId);
            return res.status(200).json(transactions);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async createTransaction(req, res) {
        try {
            const transaction = req.body;
            const newTransaction = await this.transactionModel.createTransaction(transaction);
            return res.status(201).json(newTransaction);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateTransaction(req, res) {
        try {
            const id = req.params.id;
            const transaction = req.body;
            const updatedTransaction = await this.transactionModel.updateTransaction(id, transaction);
            return res.status(200).json(updatedTransaction);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async deleteTransaction(req, res) {
        try {
            const id = req.params.id;
            await this.transactionModel.deleteTransaction(id);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default TransactionController;