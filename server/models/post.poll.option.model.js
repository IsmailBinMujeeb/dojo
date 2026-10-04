import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      requried: true,
    },
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PostPoll',
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('PostPollOption', OptionSchema);
