import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getContacts, getContactById } from './services/contacts.js';
import { getEnvVar } from './utils/getEnvVars.js';
export const setupServer = () => {
  const app = express();
  const corsMiddleware = cors();

  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });

  app.use(corsMiddleware);
  app.use(logger);

  app.get('/', (request, response) => {
    response.json({
      message: 'Start Work',
    });
  });

  app.get('/contacts', async (request, response) => {
    const contacts = await getContacts();
    response.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:id', async (request, response) => {
    const { id } = request.params;
    const contact = await getContactById(id);

    if (!contact) {
      return response.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }

    response.json({
      status: 200,
      message: 'Successfully found contact!!',
      data: contact,
    });
  });

  app.get((request, response) => {
    response.status(404).json({
      message: `${request.url} not found`,
    });
  });

  app.use((error, request, response, next) => {
    response.status(500).json({
      message: `Server error!`,
      error: error.message,
    });
  });

  const port = Number(getEnvVar('PORT', 3000));
  app.listen(port, () => console.log(`Server running on ${port} port`));
};
