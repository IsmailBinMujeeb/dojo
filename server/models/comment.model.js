import mongoose from 'mongoose';
import paginatePlugin from 'mongoose-paginate-v2';

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },

    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },

    content: {
      type: String,
      required: true,
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

commentSchema.plugin(paginatePlugin);

export default mongoose.model('Comment', commentSchema);
