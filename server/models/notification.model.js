import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
  notificationType: { type: String, enum: ['follow', 'like', 'comment'], required: true },
  followerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  likeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Like', default: null },
});

export default mongoose.model('Notification', notificationSchema);
