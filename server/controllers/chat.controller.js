import mongoose from 'mongoose';
import ApiError from '../utils/apiError.js';
import chatModel from '../models/chat.model.js';
import ApiResponse from '../utils/apiResponse.js';

// api/chat/:requiestedUsedId POST
export const createChat = async (req, res) => {
  const { requiestedUsedId } = req.params;
  const authenticatedUserId = req.user._id;

  if (!mongoose.isValidObjectId(requiestedUsedId)) {
    throw ApiError.BAD_REQUEST('Invalid user id');
  }

  if (authenticatedUserId === requiestedUsedId) {
    throw ApiError.FORBIDDEN('can not create chat with two same ids');
  }

  let userIdOne = '';
  let userIdTwo = '';

  if (authenticatedUserId > requiestedUsedId) {
    userIdOne = requiestedUsedId;
    userIdTwo = authenticatedUserId;
  } else {
    userIdOne = authenticatedUserId;
    userIdTwo = requiestedUsedId;
  }

  const isChatExist = await chatModel.findOne({ userIdOne, userIdTwo });

  if (isChatExist) throw ApiError.CONFLICT('Chat already exist');

  const newChat = await chatModel.create({
    userIdOne,
    userIdTwo,
  });

  return res.status(201).json(new ApiResponse(201, 'new chat created successfully', newChat));
};

// api/chat GET
export const getAllChats = async (req, res) => {
  const userId = req.user._id;

  const chats = await chatModel.aggregate([
    {
      $match: {
        $or: [
          { userIdOne: new mongoose.Types.ObjectId(userId) },
          { userIdTwo: new mongoose.Types.ObjectId(userId) },
        ],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userIdOne',
        foreignField: '_id',
        as: 'userIdOne',
      },
    },
    {
      $unwind: '$userIdOne',
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userIdTwo',
        foreignField: '_id',
        as: 'userIdTwo',
      },
    },
    {
      $unwind: '$userIdTwo',
    },
    {
      $lookup: {
        from: 'messages',
        localField: '_id',
        foreignField: 'chatId',
        as: 'recentMessage',
        pipeline: [
          {
            $sort: { createdAt: -1 },
          },
          {
            $limit: 1,
          },
        ],
      },
    },
    {
      $unwind: '$recentMessage',
    },
    {
      $project: {
        _id: 1,
        userIdOne: {
          _id: 1,
          username: 1,
          name: 1,
          avatar: 1,
        },
        userIdTwo: {
          _id: 1,
          username: 1,
          name: 1,
          avatar: 1,
        },
        recentMessage: {
          _id: 1,
          chatId: 1,
          senderId: 1,
          recieverId: 1,
          message: 1,
          createdAt: 1,
        },
      },
    },
  ]);

  return res.status(200).json(new ApiResponse(200, 'chats retrieved successfully', chats));
};

// api/chat/:chatId GET
export const getChat = async (req, res) => {
  const { chatId } = req.params;

  if (!mongoose.isValidObjectId(chatId)) {
    throw ApiError.BAD_REQUEST('Invalid chat id');
  }

  // const chat = await chatModel.findById(chatId).populate('userIdOne').populate('userIdTwo');
  const [chat] = await chatModel.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(chatId) },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userIdOne',
        foreignField: '_id',
        as: 'userOne',
      },
    },
    {
      $unwind: '$userOne',
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userIdTwo',
        foreignField: '_id',
        as: 'userTwo',
      },
    },
    {
      $unwind: '$userTwo',
    },
    {
      $lookup: {
        from: 'messages',
        localField: '_id',
        foreignField: 'chatId',
        as: 'messages',
        pipeline: [
          {
            $sort: { createdAt: -1 },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        userOne: {
          _id: 1,
          username: 1,
          name: 1,
          avatar: 1,
        },
        userTwo: {
          _id: 1,
          username: 1,
          name: 1,
          avatar: 1,
        },
        messages: {
          _id: 1,
          chatId: 1,
          senderId: 1,
          recieverId: 1,
          message: 1,
          createdAt: 1,
        },
      },
    },
  ]);

  if (!chat) throw ApiError.NOT_FOUND('Chat not found');

  return res.status(200).json(new ApiResponse(200, 'chat retrieved successfully', chat));
};
