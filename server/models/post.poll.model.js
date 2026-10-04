import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('PostPoll', pollSchema);
