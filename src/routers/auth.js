import { Router } from 'express';

import { validateBody } from '../utils/validateBody.js';

import { authLoginSchema, authRegisterSchema } from '../validation/auth.js';

import * as authController from '../controllers/auth.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(authRegisterSchema),
  ctrlWrapper(authController.registerController),
);

authRouter.post(
  '/login',
  validateBody(authLoginSchema),
  ctrlWrapper(authController.loginController),
);

export default authRouter;
