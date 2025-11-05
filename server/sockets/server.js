import { Server } from 'socket.io';
import app from '../server.js';
import http from 'http';
import env from '../config/env.js';
import messageModel from '../models/message.model.js';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('joinroom', (roomId) => {
    socket.join(roomId);
  });

  socket.on('sendmessage', async ({ message, senderId, receiverId, chatId }) => {
    try {
      const newMessage = await messageModel.create({
        message,
        senderId,
        receiverId,
        chatId,
      });

      io.to(chatId).emit('newmessage', { _id: newMessage._id, message, senderId, receiverId });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.roomId);
  });
});

export default server;
