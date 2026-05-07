import mongoose, { isValidObjectId } from 'mongoose';
import userModel from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import setAuthCookies from '../utils/setAuthCookies.js';
import postModel from '../models/post.model.js';
import cloudinary from '../utils/cloudinary.js';
import notificationModel from '../models/notification.model.js';

const fetchUser = async (query) => {
  return await userModel.aggregate([
    {
      $match: query,
    },
    {
      $lookup: {
        from: 'followers',
        localField: '_id',
        foreignField: 'followedTo',
        as: 'followers',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'followedBy',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $unwind: '$user',
          },
          {
            $project: {
              _id: 1,
              user: {
                _id: 1,
                email: 1,
                username: 1,
                name: 1,
                avatar: 1,
                coverPhoto: 1,
                academicRank: 1,
              },
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'followers',
        localField: '_id',
        foreignField: 'followedBy',
        as: 'following',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'followedTo',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $unwind: '$user',
          },
          {
            $project: {
              _id: 1,
              user: {
                _id: 1,
                email: 1,
                username: 1,
                name: 1,
                avatar: 1,
                coverPhoto: 1,
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        followersCount: { $size: '$followers' },
        followingCount: { $size: '$following' },
        joinedAt: { $dateToString: { format: '%b %Y', date: '$createdAt' } },
      },
    },
    {
      $project: {
        password: 0,
        refreshToken: 0,
      },
    },
  ]);
};

export const registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    throw ApiError.BAD_REQUEST('All fields are required');
  }

  const isUserExist = await userModel.findOne({ $or: [{ email }, { username }] });

  console.log(isUserExist);
  if (isUserExist) {
    throw ApiError.CONFLICT('User already exists');
  }

  const user = await userModel.create({ name, username, email, password });

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  setAuthCookies(res, { accessToken, refreshToken });

  res
    .status(201)
    .json(new ApiResponse(201, 'User registered successfully', { accessToken, refreshToken }));
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw ApiError.BAD_REQUEST('All fields are required');
  }

  const user = await userModel.findOne({ username });

  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.UNAUTHORIZED('Invalid username or password');
  }

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  setAuthCookies(res, { accessToken, refreshToken });

  res
    .status(200)
    .json(new ApiResponse(200, 'User logged in successfully', { accessToken, refreshToken }));
};

export const logoutUser = async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.headers['authorization'].split(' ')[1];

  if (!incomingRefreshToken) {
    throw ApiError.UNAUTHORIZED('Unauthorized');
  }

  await userModel.findOneAndUpdate(
    { refreshToken: incomingRefreshToken },
    { $unset: { refreshToken: 1 } },
  );

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).json(new ApiResponse(200, 'User logged out successfully'));
};

export const me = async (req, res) => {
  const [user] = await fetchUser({ _id: new mongoose.Types.ObjectId(req.user._id) });

  if (!user) {
    throw ApiError.NOT_FOUND('User not found');
  }

  res.status(200).json(new ApiResponse(200, 'User details fetched successfully', user));
};

// GET api/user/profile/:username
export const getUserByUsername = async (req, res) => {
  const userId = req.user?._id;
  const [user] = await fetchUser({ username: req.params.username });

  if (!user) {
    throw ApiError.NOT_FOUND('User not found');
  }

  const isUserFollowingProfile = user.followers?.some(
    (follower) => userId === follower.user._id.toString(),
  );

  const isProfileBelongsToAthenticatedUser = userId === user._id.toString();

  res.status(200).json(
    new ApiResponse(200, 'User details fetched successfully', {
      ...user,
      isProfileBelongsToAthenticatedUser,
      isUserFollowingProfile,
    }),
  );
};

// GET api/user/get-recent-users
export const getRecentUsers = async (req, res) => {
  const users = await userModel
    .find({})
    .sort({ createdAt: -1 })
    .limit(3)
    .select('-password -refreshToken');

  res.status(200).json(new ApiResponse(200, 'User details fetched successfully', users));
};

// GET api/user/posts/:userId
export const getUsersPost = async (req, res) => {
  const { userId } = req.params;
  const authenticatedUserId = req.user._id;
  const { limit = 10, page = 1 } = req.query;

  console.log('user', userId);
  if (limit < 1 || page < 1) {
    throw ApiError.BAD_REQUEST('Invalid quary');
  }

  if (!isValidObjectId(userId)) {
    throw ApiError.BAD_REQUEST('Invalid user id');
  }

  const skip = (page - 1) * limit;

  const posts = await postModel.aggregate([
    { $match: { author: new mongoose.Types.ObjectId(userId) } },
    { $skip: skip },
    { $limit: limit },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author',
        pipeline: [
          {
            $project: {
              password: 0,
              refreshToken: 0,
            },
          },
        ],
      },
    },
    {
      $unwind: '$author',
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'postId',
        as: 'likes',
      },
    },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'postId',
        as: 'comments',
      },
    },
    {
      $lookup: {
        from: 'bookmarks',
        localField: '_id',
        foreignField: 'postId',
        as: 'bookmarks',
      },
    },
    {
      $addFields: {
        likesCount: { $size: '$likes' },
        commentsCount: { $size: '$comments' },
        isLiked: {
          $in: [new mongoose.Types.ObjectId(authenticatedUserId), '$likes.userId'],
        },
        isBookmarked: {
          $in: [new mongoose.Types.ObjectId(authenticatedUserId), '$bookmarks.userId'],
        },
      },
    },
  ]);

  return res.status(200).json(new ApiResponse(200, 'User posts fetched successfully', posts));
};

export const getUsersNotifications = async (req, res) => {
  const userId = req.user?._id;
  const { limit = 10, page = 1 } = req.query;

  if (limit < 1 || page < 1) {
    throw ApiError.BAD_REQUEST('Invalid quary');
  }

  if (!isValidObjectId(userId)) {
    throw ApiError.BAD_REQUEST('Invalid user id');
  }

  const skip = (page - 1) * limit;

  const notifications = await notificationModel.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $skip: skip },
    { $limit: limit },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
        pipeline: [
          {
            $project: {
              password: 0,
              refreshToken: 0,
            },
          },
        ],
      },
    },
    {
      $unwind: '$user',
    },
    {
      $lookup: {
        from: 'users',
        localField: 'followerId',
        foreignField: '_id',
        as: 'follower',
        pipeline: [
          {
            $project: {
              password: 0,
              refreshToken: 0,
            },
          },
        ],
      },
    },
    {
      $unwind: { path: '$follower', preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: 'posts',
        localField: 'postId',
        foreignField: '_id',
        as: 'post',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'author',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $unwind: { path: '$user', preserveNullAndEmptyArrays: true },
          },
        ],
      },
    },
    {
      $unwind: { path: '$post', preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: 'comments',
        localField: 'commentId',
        foreignField: '_id',
        as: 'comment',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $unwind: { path: '$user', preserveNullAndEmptyArrays: true },
          },
          {
            $lookup: {
              from: 'posts',
              localField: 'postId',
              foreignField: '_id',
              as: 'post',
            },
          },
          {
            $unwind: { path: '$post', preserveNullAndEmptyArrays: true },
          },
        ],
      },
    },
    {
      $unwind: { path: '$comment', preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: 'likes',
        localField: 'likeId',
        foreignField: '_id',
        as: 'like',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $unwind: { path: '$user', preserveNullAndEmptyArrays: true },
          },
          {
            $lookup: {
              from: 'posts',
              localField: 'postId',
              foreignField: '_id',
              as: 'post',
            },
          },
          {
            $unwind: { path: '$post', preserveNullAndEmptyArrays: true },
          },
        ],
      },
    },
    {
      $unwind: { path: '$like', preserveNullAndEmptyArrays: true },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, 'User posts fetched successfully', notifications));
};

export const refreshAccessToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.headers['authorization'].split(' ')[1];

  if (!incomingRefreshToken) {
    throw ApiError.UNAUTHORIZED('Unauthorized');
  }

  const user = await userModel.findOne({ refreshToken: incomingRefreshToken });

  if (!user) {
    throw ApiError.UNAUTHORIZED('Invalid refresh token');
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  setAuthCookies(res, { accessToken, refreshToken });

  res
    .status(200)
    .json(
      new ApiResponse(200, 'Access token refreshed successfully', { accessToken, refreshToken }),
    );
};

export const updateUser = async (req, res) => {
  const { _id } = req.user;
  const { bio, name, location, website, academicRank } = req.body;

  if (!bio || !name || !location || !website || !academicRank) {
    throw ApiError.BAD_REQUEST('Missing required fields');
  }

  if (req.file) {
    const secureUrl = await cloudinary(req.file?.path);

    const user = await userModel.findByIdAndUpdate(
      _id,
      { bio, name, location, website, avatar: secureUrl, academicRank },
      { new: true },
    );

    if (!user) {
      throw ApiError.NOT_FOUND('User not found');
    }
    return res.status(200).json(new ApiResponse(200, 'User updated successfully', user));
  }

  const user = await userModel.findByIdAndUpdate(
    _id,
    { bio, name, location, website, academicRank },
    { new: true },
  );

  if (!user) {
    throw ApiError.NOT_FOUND('User not found');
  }
  res.status(200).json(new ApiResponse(200, 'User updated successfully', user));
};

export const deleteUser = async (req, res) => {
  const { _id } = req.user;

  const user = await userModel.findByIdAndDelete(_id);

  if (!user) {
    throw ApiError.NOT_FOUND('User not found');
  }

  res.status(200).json(new ApiResponse(200, 'User deleted successfully', user));
};
