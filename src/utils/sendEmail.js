import nodemailer from 'nodemailer';

import { getEnvVar } from './getEnvVars.js';
const SMTP_HOST = getEnvVar('SMTP_HOST');
const SMTP_PORT = getEnvVar('SMTP_PORT');
const SMTP_PASSWORD = getEnvVar('SMTP_PASSWORD');
const SMTP_USER = getEnvVar('SMTP_USER');

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};
