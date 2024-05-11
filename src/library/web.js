import express from "express";
import {publicRouter} from "../routes/publicApi.js";
import {errorMiddleware} from "../middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import {usersRouter} from "../routes/usersRoutes.js";

export const web = express();
web.use(express.json());
web.use(cookieParser());

web.use(publicRouter);
web.use(usersRouter);

web.use(errorMiddleware);