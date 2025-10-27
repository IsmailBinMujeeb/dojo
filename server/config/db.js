import mongoose from 'mongoose';
import env from './env.js';

export default async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(env.DB_URI);
    console.log('Database connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
