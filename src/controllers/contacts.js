import { request, response } from 'express';
import {
  getContactById,
  getContacts,
  addData,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { sortByList } from '../db/models/contactsList.js';
import { parseContactsFilterParams } from '../utils/filters/parseContactsFilterParams.js';

export const getContactsController = async (request, response) => {
  const { page, perPage } = parsePaginationParams(request.query);
  const { sortBy, sortOrder } = parseSortParams(request.query, sortByList);
  const filter = parseContactsFilterParams(request.query);
  const contacts = await getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });
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

export const addContactController = async (request, response) => {
  const contact = await addData(request.body);
  response.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    contact,
  });
};

export const upsertContactController = async (request, response) => {
  const { id } = request.params;
  const { isNew, data } = await updateContact(id, request.body, {
    upsert: true,
  });

  const status = isNew ? 201 : 200;

  response.status(status).json({
    status: status,
    message: 'Successfully upsert a contact!',
    data: data,
  });
};

export const patchContactController = async (request, response) => {
  const { id } = request.params;
  const contact = await updateContact(id, request.body);

  if (!contact) {
    throw createError(404, `Contact ${id} not found`);
  }

  response.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact.data,
  });
};

export const deleteContactController = async (request, response) => {
  const { id } = request.params;
  const data = await deleteContact({ _id: id });

  if (!data) {
    throw createError(404, `Contact ${id} not found`);
  }
  response.status(204).json({
    status: 204,
  });
};
