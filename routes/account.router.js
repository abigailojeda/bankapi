import { Router } from 'express';
import AccountController from '../controllers/account.controller.js';

const createAccountRouter = ({ AccountModel }) => {
    const router = Router();

    const accountController = new AccountController({ AccountModel });

    router.get('/', (req, res) => accountController.getAccounts(req, res));
    router.get('/:id', (req, res) => accountController.getAccountById(req, res));
    router.get('/user/:userId', (req, res) => accountController.getAccountsByUserId(req, res));
    router.put('/:id/balance', (req, res) => accountController.updateBalance(req, res));
    router.put('/:id/currency', (req, res) => accountController.updateCurrency(req, res));

    return router;
}

export { createAccountRouter };