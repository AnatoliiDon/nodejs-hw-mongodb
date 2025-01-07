import express from 'express';
import cors from 'cors';
import { logger } from './middlewares/logger.js';
import { getEnvVar } from './utils/getEnvVars.js';
import contactsRouter from './routers/contacts.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';

export const setupServer = () => {
  const app = express();
  const corsMiddleware = cors();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);
  app.use(corsMiddleware);
  app.use(logger);

  app.get('/', (request, response) => {
    response.json({
      message: 'Start Work',
    });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  const port = Number(getEnvVar('PORT', 3000));
  app.listen(port, () => console.log(`Server running on ${port} port`));
};
