import { Worker } from 'bullmq';
import notificationModel from '../models/notification.model.js';
import env from '../config/env.js';

export const notificationWorker = () => {
  return new Worker(
    'notification',
    async (job) => {
      console.log(JSON.stringify(job));

      const { userId, type } = job.data;

      if (type === 'follow') {
        const { followerId } = job.data;
        await notificationModel.create({ userId, notificationType: type, followerId });
      } else if (type === 'like') {
        const { postId, likeId } = job.data;
        await notificationModel.create({ userId, notificationType: type, postId, likeId });
      } else if (type === 'comment') {
        const { postId, commentId, message } = job.data;
        await notificationModel.create({
          userId,
          notificationType: type,
          postId,
          commentId,
          message,
        });
      }
    },
    { connection: { host: env.REDIS_HOST, port: env.REDIS_PORT, password: env.REDIS_PASSWORD } },
  );
};
