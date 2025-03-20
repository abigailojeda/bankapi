import { Router } from 'express';
import TransactionController from '../controllers/transaction.controller.js';

const createTransactionRouter = ({ TransactionModel }) => {
    const router = Router();

    const transactionController = new TransactionController({ TransactionModel });

    router.get('/', (req, res) => transactionController.getTransactions(req, res));
    router.get('/:id', (req, res) => transactionController.getTransactionById(req, res));
    router.get('/account/:accountId', (req, res) => transactionController.getTransactionsByAccountId(req, res));
    router.post('/', (req, res) => transactionController.createTransaction(req, res));
    router.put('/:id', (req, res) => transactionController.updateTransaction(req, res));
    router.delete('/:id', (req, res) => transactionController.deleteTransaction(req, res));

    return router;
}

export { createTransactionRouter };