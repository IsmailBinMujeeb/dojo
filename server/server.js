import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import env from './config/env.js';
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';
import likeRouter from './routes/like.route.js';
import commentRouter from './routes/comment.route.js';
import commentLikeRouter from './routes/comment.like.route.js';
import bookmarkRouter from './routes/bookmark.route.js';
import followerRouter from './routes/follower.route.js';
import exploreRouter from './routes/explore.route.js';
import chatRouter from './routes/chat.route.js';
import morgan from 'morgan';

const app = express();
const PORT = env.PORT;

app.set('port', PORT);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// app.use((req, res, next) => {
//   setTimeout(() => {
//     next();
//   }, 3000);
// });

app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/like', likeRouter);
app.use('/api/comment', commentRouter);
app.use('/api/comment-like', commentLikeRouter);
app.use('/api/bookmark', bookmarkRouter);
app.use('/api/explore', exploreRouter);
app.use('/api/chat', chatRouter);
app.use('/api', followerRouter);

app.get('/api/health', (req, res) => {
  res.send('Server is healthy');
});

setInterval(() => {
  fetch(`/api/health`).catch((error) => console.error(error));
}, 3_00_000);

export default app;
