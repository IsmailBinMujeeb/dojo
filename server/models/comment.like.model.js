import mongoose from 'mongoose';
import paginatePlugin from 'mongoose-paginate-v2';

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required: true,
    },
  },
  { timestamps: true }
);

likeSchema.plugin(paginatePlugin);

export default mongoose.model('CommentLike', likeSchema);
