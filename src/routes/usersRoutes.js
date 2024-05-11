import express from "express";
import usersController from "../controller/usersController.js";
import {authMiddleware} from '../middleware/authMiddleware.js';


const usersRouter = new express.Router();
usersRouter.use(authMiddleware);

// users
usersRouter.get('/api/users/:userId', authMiddleware, usersController.getUserById);
usersRouter.patch('/api/users/:userId', authMiddleware, usersController.editUserById);
usersRouter.delete('/api/users/logout', authMiddleware, usersController.logout);


export {
  usersRouter
}