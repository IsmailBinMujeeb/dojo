import { config } from 'dotenv';

config();

export default {
  PORT: String(process.env.PORT || 3000),
  DB_URI: String(process.env.DB_URI || 'mongodb://localhost:27017/dojo'),
  NODE_ENV: String(process.env.NODE_ENV || 'development'),
  CLOUD_NAME: String(process.env.CLOUD_NAME || 'cloud_name'),
  CLOUD_SECRET: String(process.env.CLOUD_SECRET || 'cloud_secret'),
  CLOUD_API_KEY: String(process.env.CLOUD_API_KEY || 'cloud_api_key'),
  ACCESS_TOKEN_SECRET: String(process.env.ACCESS_TOKEN_SECRET || 'access_token_secret'),
  ACCESS_TOKEN_EXPIRY: String(process.env.ACCESS_TOKEN_EXPIRY || 'access_token_expiry'),
  REFRESH_TOKEN_SECRET: String(process.env.REFRESH_TOKEN_SECRET || 'refresh_token_secret'),
  REFRESH_TOKEN_EXPIRY: String(process.env.REFRESH_TOKEN_EXPIRY || 'refresh_token_expiry'),
  CORS_ORIGIN: String(process.env.CORS_ORIGIN || '').split(','),
  REDIS_HOST: String(process.env.REDIS_HOST || 'localhost'),
  REDIS_PORT: Number(process.env.REDIS_PORT || 6379),
  REDIS_PASSWORD: String(process.env.REDIS_PASSWORD || ''),
  GOOGLE_API_KEY: String(process.env.GOOGLE_API_KEY || 'your_gemini_api_key'),
};
