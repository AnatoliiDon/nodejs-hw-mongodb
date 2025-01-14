import { request, response } from 'express';
import {
  getContactById,
  getContacts,
  addData,
  updateContact,
  deleteContact,
  getContact,
} from '../services/contacts.js';
import createError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { sortByList } from '../db/models/contactsList.js';
import { parseContactsFilterParams } from '../utils/filters/parseContactsFilterParams.js';
import { saveFileToUploadsDir } from '../utils/saveFileToUploadsDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getContactsController = async (request, response) => {
  const { page, perPage } = parsePaginationParams(request.query);
  const { sortBy, sortOrder } = parseSortParams(request.query, sortByList);
  const filter = parseContactsFilterParams(request.query);
  filter.userId = request.user._id;
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
  const { _id: userId } = request.user;
  const { id: _id } = request.params;

  const contact = await getContact({ _id, userId });

  if (!contact) {
    throw createError(404, `Contact ${_id} not found`);
  }

  response.json({
    status: 200,
    message: 'Successfully found contact!!',
    data: contact,
  });
};

export const addContactController = async (request, response) => {
  let photo;
  if (request.file) {
    photo = await saveFileToCloudinary(request.file);
  }
  const { _id: userId } = request.user;
  const contact = await addData({ ...request.body, photo, userId });
  response.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const upsertContactController = async (request, response) => {
  const { id: _id } = request.params;
  const { _id: userId } = request.user;
  const { isNew, data } = await updateContact(
    _id,
    { ...request.body, userId },
    {
      upsert: true,
    },
  );

  const status = isNew ? 201 : 200;

  response.status(status).json({
    status: status,
    message: 'Successfully upsert a contact!',
    data: data,
  });
};

export const patchContactController = async (request, response) => {
  let photo;
  if (request.file) {
    photo = await saveFileToCloudinary(request.file);
  }
  const { id: _id } = request.params;
  const { _id: userId } = request.user;
  const contact = await updateContact(
    { _id, userId },
    { ...request.body, photo },
  );

  if (!contact) {
    throw createError(404, `Contact ${_id} not found`);
  }

  response.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact.data,
  });
};

export const deleteContactController = async (request, response) => {
  const { id: _id } = request.params;
  const { _id: userId } = request.user;
  const data = await deleteContact({ _id, userId });

  if (!data) {
    throw createError(404, `Contact ${_id} not found`);
  }
  response.status(204).json({
    status: 204,
  });
};
