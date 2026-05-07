import { Queue } from 'bullmq';
import env from '../config/env.js';

export const notificationQueue = new Queue('notification', {
  connection: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
  },
});
