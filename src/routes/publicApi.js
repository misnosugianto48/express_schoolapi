import express from "express";
import usersController from "../controller/usersController.js";
// import healthController from "../controller/health-controller.js";

const publicRouter = new express.Router();
publicRouter.post('/api/users', usersController.register);
// publicRouter.post('/api/users/login', usersController.login);
// publicRouter.get('/ping', healthController.ping);

export {
    publicRouter
}