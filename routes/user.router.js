import { Router } from 'express';
import UserController from '../controllers/user.controller.js';

const createUserRouter = ({ UserModel }) => {
    const router = Router();

    const userController = new UserController({ UserModel });

    router.get('/', (req, res) => userController.getUsers(req, res));
    router.get('/:id', (req, res) => userController.getUserById(req, res));

    return router;
}

export { createUserRouter };