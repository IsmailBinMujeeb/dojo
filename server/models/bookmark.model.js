import mongoose from 'mongoose';
import paginatePlugin from 'mongoose-paginate-v2';

const bookmarkSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

bookmarkSchema.plugin(paginatePlugin);

export default mongoose.model('Bookmark', bookmarkSchema);
