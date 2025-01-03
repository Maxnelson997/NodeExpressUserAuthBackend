import express from 'express';
import { getUsers, registerUser, loginUser } from '../controllers/usersController.js';

const router = express.Router();

// fetches all users
router.get('/', getUsers);
// registers a user
router.post('/register', registerUser);
// logs in a user
router.post('/login', loginUser);


export { router as userRoutes }
