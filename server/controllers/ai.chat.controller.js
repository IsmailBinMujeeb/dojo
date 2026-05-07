import mongoose from 'mongoose';
import { sarvam } from '../config/ai.js';
import aiChatModel from '../models/ai.chat.model.js';
import ApiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/apiError.js';

export const createAiChat = async (req, res) => {
  const { message } = req.body;
  const userId = req.user._id;

  const aiResponse = await sarvam.chat.completions({
    model: 'sarvam-30b',
    messages: [
      {
        role: 'user',
        content: `write a chat title for this message: ${message}, response format should be JSON in {"title": "<title>"} and response should only contain the JSON object without any additional text.`,
      },
    ],
    temperature: 0.5,
    top_p: 1,
    max_tokens: 2000,
  });

  const response = aiResponse.choices[0].message.content;
  const title = JSON.parse(response).title;

  const aiChat = await aiChatModel.create({
    title,
    userId,
  });

  return res.status(201).json(new ApiResponse(201, 'AI chat created successfully', aiChat));
};

export const getAiChats = async (req, res) => {
  const userId = req.user._id;
  const aiChats = await aiChatModel.find({ userId });
  return res.status(200).json(new ApiResponse(200, 'AI chats fetched successfully', aiChats));
};

export const getAiChat = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const [aiChat] = await aiChatModel.aggregate([
    {
      $match: {
        $and: [
          { _id: new mongoose.Types.ObjectId(id) },
          { userId: new mongoose.Types.ObjectId(userId) },
        ],
      },
    },
    {
      $lookup: {
        from: 'aimessages',
        localField: '_id',
        foreignField: 'chatId',
        as: 'messages',
      },
    },
  ]);

  if (!aiChat) throw ApiError.NOT_FOUND('AI chat not found');
  return res.status(200).json(new ApiResponse(200, 'AI chat fetched successfully', aiChat));
};
