import { setupServer } from './server.js';
import { initMongoDB } from './db/initMongoDB.js';
const boostrap = async () => {
  await initMongoDB();
  setupServer();
};
boostrap();
