import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import friendRouter from './routes/friendRoutes.js';


import { connectMongoDB } from './db/initMongoConnection.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { logger } from './middlewares/logger.js';

import userRouter from './routes/userRouter.js';
import localRouter from './routes/locationRoutes.js';
import authRouter from './routes/authRouters.js';
import commentsRouter from './routes/commentsRouter.js';

import { errors } from 'celebrate';


const app = express();

const PORT = Number.parseInt(process.env.PORT, 10) || 3000;

app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true,
}));
app.use(express.json({limit: '200kb',}));
app.use(cookieParser());

app.use(logger);

app.use(userRouter);
app.use(localRouter);
app.use(authRouter);
app.use(commentsRouter);
app.use(friendRouter);

app.use(errors());


app.use(notFoundHandler);
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, error => {
  if (error) {
    console.error('Помилка запуску сервера:', error);
    throw error;
  }
  console.log(`Сервер запущено на порту ${PORT}`);
})
