import express from 'express';
import {
  addContactController,
  getContactByIdController,
  getContactsController,
  upsertContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = express.Router();

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get('/:id', ctrlWrapper(getContactByIdController));

contactsRouter.post('/', ctrlWrapper(addContactController));

contactsRouter.put('/:id', ctrlWrapper(upsertContactController));

contactsRouter.patch('/:id', ctrlWrapper(patchContactController));

contactsRouter.delete('/:id', ctrlWrapper(deleteContactController));

export default contactsRouter;
