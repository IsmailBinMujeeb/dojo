import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    bio: {
      type: String,
      trim: true,
      default: '',
    },

    location: {
      type: String,
      default: '',
    },

    website: {
      type: String,
      trim: true,
      default: '',
    },

    avatar: {
      type: String,
      default:
        'https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png',
    },

    coverPhoto: {
      type: String,
      default:
        'https://business.x.com/content/dam/business-twitter/textured-backgrounds/banner-full-blue-scratch.jpg.twimg.1280.jpg',
    },

    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  const token = jwt.sign({ _id: this._id }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRY,
  });
  return token;
};

userSchema.methods.generateRefreshToken = async function () {
  const token = jwt.sign({ _id: this._id }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRY,
  });
  this.refreshToken = token;
  await this.save();
  return token;
};

export default mongoose.model('User', userSchema);
