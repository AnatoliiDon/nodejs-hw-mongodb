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
import { validateBody } from '../utils/validateBody.js';
import { autheticate } from '../middlewares/autheticate.js';

import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validation/contacts.js';

import { isValidId } from '../middlewares/isValidId.js';

const contactsRouter = express.Router();

contactsRouter.use(autheticate);

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get('/:id', isValidId, ctrlWrapper(getContactByIdController));

contactsRouter.post(
  '/',
  validateBody(contactAddSchema),
  ctrlWrapper(addContactController),
);

contactsRouter.put(
  '/:id',
  validateBody(contactUpdateSchema),
  isValidId,
  ctrlWrapper(upsertContactController),
);

contactsRouter.patch(
  '/:id',
  validateBody(contactUpdateSchema),
  isValidId,
  ctrlWrapper(patchContactController),
);

contactsRouter.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

export default contactsRouter;
