import createHttpError from 'http-errors';
import UserCollection from '../db/models/User.js';
import sessionCollection from '../db/models/session.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import {
  accessTokenLifeTime,
  refteshTokenLifeTime,
} from '../constants/user.js';

import { getEnvVar } from '../utils/getEnvVars.js';
import { sendEmail } from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';

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
  const accessTokenValidUntil = Date.now() + accessTokenLifeTime;
  const refreshTokenValidUntil = Date.now() + refteshTokenLifeTime;
  return await sessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: accessTokenValidUntil,
    refreshTokenValidUntil: refreshTokenValidUntil,
  });
};

export const refreshToken = async (payload) => {
  const oldSession = await sessionCollection.findOne({
    _id: payload.sessionId,
    refreshToken: payload.refreshToken,
  });
  if (!oldSession) {
    throw createHttpError(401, 'session not found');
  }

  if (Date.now() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, 'refresh token expired');
  }

  await sessionCollection.deleteOne({ _id: payload.sessionId });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = Date.now() + accessTokenLifeTime;
  const refreshTokenValidUntil = Date.now() + refteshTokenLifeTime;
  return await sessionCollection.create({
    userId: oldSession.userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: accessTokenValidUntil,
    refreshTokenValidUntil: refreshTokenValidUntil,
  });
};

export const logout = async (sessionId) => {
  await sessionCollection.deleteOne({ _id: sessionId });
};

export const getUser = (filter) => UserCollection.findOne(filter);

export const getSession = (filter) => sessionCollection.findOne(filter);

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const SMTP_FROM = getEnvVar('SMTP_FROM');
  const JWT_SECRET = getEnvVar('JWT_SECRET');
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    JWT_SECRET,
    {
      expiresIn: '5m',
    },
  );

  await sendEmail({
    from: SMTP_FROM,
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetToken}">here</a> to reset your password!</p>`,
  });
};
