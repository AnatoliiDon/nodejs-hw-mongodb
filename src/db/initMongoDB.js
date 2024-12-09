import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVars.js';
const DB_HOST = getEnvVar('DB_HOST');

export const initMongoDB = async () => {
  try {
    await mongoose.connect(DB_HOST);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.log(`Error connection Mongo ${error.message}`);
    throw error;
  }
};
