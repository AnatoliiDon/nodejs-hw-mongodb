import { getContactById, getContacts } from '../services/contacts.js';
import createError from 'http-errors';

export const getContactsController = async (request, response) => {
  const contacts = await getContacts();
  response.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (request, response) => {
  const { id } = request.params;
  const contact = await getContactById(id);

  if (!contact) {
    throw createError(404, `Contact ${id} not found`);
  }

  response.json({
    status: 200,
    message: 'Successfully found contact!!',
    data: contact,
  });
};
