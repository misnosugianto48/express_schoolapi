import express from 'express';
import cookiesParser from 'cookie-parser';

export const web = express();
web.use(express.json());
web.use(cookiesParser());