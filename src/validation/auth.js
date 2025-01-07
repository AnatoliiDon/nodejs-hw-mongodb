import Joi from 'joi';
import { emailRegexp } from '../constants/user.js';

export const authRegisterSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const authLoginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
