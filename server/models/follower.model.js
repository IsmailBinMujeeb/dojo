import mongoose from 'mongoose';
import paginatePlugin from 'mongoose-paginate-v2';

const followerSchema = new mongoose.Schema(
  {
    followedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    followedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

followerSchema.plugin(paginatePlugin);

export default mongoose.model('Follower', followerSchema);
