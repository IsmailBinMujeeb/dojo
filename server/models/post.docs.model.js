import mongoose from 'mongoose';

const docSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      requried: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    type: {
      type: String,
      enum: ['image', 'other'],
      default: 'other',
    },
  },
  { timestamps: true },
);

export default mongoose.model('PostDoc', docSchema);
