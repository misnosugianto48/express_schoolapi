import express from "express";
import {publicRouter} from "../routes/publicApi.js";
import {errorMiddleware} from "../middleware/errorMiddleware.js";
// import {userRouter} from "../routes/api.js";

export const web = express();
web.use(express.json());

web.use(publicRouter);
// web.use(userRouter);

web.use(errorMiddleware);