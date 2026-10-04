import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    optionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PostPollOption',
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('PostPollOptionVote', voteSchema);
