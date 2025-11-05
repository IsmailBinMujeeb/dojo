import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    userIdOne: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    userIdTwo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
  },
  { timestamps: true }
);

chatSchema.index({ userIdOne: 1, userIdTwo: 1 }, { unique: true });

chatSchema.pre('save', function (next) {
  if (this.userIdOne.toString() > this.userIdTwo.toString()) {
    // swap so userIdOne is always the smaller one
    const temp = this.userIdOne;
    this.userIdOne = this.userIdTwo;
    this.userIdTwo = temp;
  }
  next();
});

export default mongoose.model('Chat', chatSchema);
