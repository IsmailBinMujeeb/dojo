import mongoose from 'mongoose';
import paginatePlugin from 'mongoose-paginate-v2';

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    isRepost: {
      type: Boolean,
      default: false,
    },

    repostOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: false,
    },

    originalAuthor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },

    media: {
      type: [String],
      default: [],
    },

    links: {
      type: [String],
      default: [],
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

postSchema.plugin(paginatePlugin);

export default mongoose.model('Post', postSchema);
