import createHttpError from 'http-errors';
import UserCollection from '../db/models/User.js';
import sessionCollection from '../db/models/session.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import {
  accessTokenLifeTime,
  refteshTokenLifeTime,
} from '../constants/user.js';

export const register = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await UserCollection.create({
    ...payload,
    password: hashPassword,
  });
  return newUser;
};

export const login = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid!');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid!');
  }

  await sessionCollection.deleteOne({ userId: user._id });
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  return await sessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + accessTokenLifeTime,
    refreshTokenValidUntil: Date.now() + refteshTokenLifeTime,
  });
};
