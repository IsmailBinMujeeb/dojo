import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import env from './env.js';

const model = new ChatGoogleGenerativeAI({
  apiKey: env.GOOGLE_API_KEY,
});

export { model };
