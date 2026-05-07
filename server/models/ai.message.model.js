import mongoose from 'mongoose';

const aiMessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AiChat',
      require: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    from: {
      type: String,
      required: true,
      enum: ['user', 'ai'],
    },
  },
  { timestamps: true },
);

export default mongoose.model('AiMessage', aiMessageSchema);
