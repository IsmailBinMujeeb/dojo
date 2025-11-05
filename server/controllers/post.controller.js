import mongoose from 'mongoose';
import postModel from '../models/post.model.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';

// POST api/post
export const createPost = async (req, res) => {
  const { content } = req.body;
  const userId = req.user._id;

  if (!content) {
    throw ApiError.BAD_REQUEST('Content is required');
  }

  const post = await postModel.create({ content, author: userId });
  res.status(201).json(new ApiResponse(201, 'Post created successfully', post));
};

// GET api/post/:id
export const getPost = async (req, res) => {
  const { id } = req.params;

  const [post] = await postModel.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(id) },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author',
      },
    },
    {
      $unwind: '$author',
    },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'postId',
        as: 'comments',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'author',
            },
          },
          {
            $unwind: '$author',
          },
          {
            $lookup: {
              from: 'comments',
              localField: '_id',
              foreignField: 'parentComment',
              as: 'comments',
            },
          },
          {
            $lookup: {
              from: 'commentlikes',
              localField: '_id',
              foreignField: 'commentId',
              as: 'likes',
            },
          },
          {
            $addFields: {
              likesCount: { $size: '$likes' },
              commentsCount: { $size: '$comments' },
              createdAt: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        author: {
          _id: 1,
          username: 1,
          email: 1,
          name: 1,
          avatar: 1,
          bio: 1,
        },
        comments: {
          _id: 1,
          content: 1,
          author: {
            _id: 1,
            username: 1,
            email: 1,
            name: 1,
            avatar: 1,
          },
          comments: {
            _id: 1,
          },
          commentsCount: 1,
          likes: {
            _id: 1,
          },
          likesCount: 1,
          createdAt: 1,
        },
        views: 1,
        createdAt: 1,
        updatedAt: 1,
      },
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
      $addFields: {
        likesCount: { $size: '$likes' },
        commentsCount: { $size: '$comments' },
        createdTime: { $dateToString: { format: '%H:%M', date: '$createdAt' } },
        createdDate: { $dateToString: { format: '%b %d, %Y', date: '$createdAt' } },
      },
    },
  ]);

  console.log(post);
  if (!post) {
    throw ApiError.NOT_FOUND('Post not found');
  }

  res.status(200).json(new ApiResponse(200, 'Post retrieved successfully', post));
};

// GET api/post
export const getPosts = async (req, res) => {
  const { page = 1, limit = 50 } = req.query;

  const skip = (page - 1) * limit;
  const posts = await postModel.aggregate([
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
      $addFields: {
        likesCount: { $size: '$likes' },
        commentsCount: { $size: '$comments' },
        createdAt: { $dateToString: { format: '%b %Y', date: '$createdAt' } },
      },
    },
  ]);

  res.status(200).json(new ApiResponse(200, 'Posts retrieved successfully', posts));
};

// DELETE api/post/:id
export const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const post = await postModel.findById(id);

  if (!post) {
    throw ApiError.NOT_FOUND('Post not found');
  }

  if (userId !== post.author.toString()) {
    throw ApiError.FORBIDDEN('You are not authorized to delete this post');
  }

  const deletedPost = await postModel.findByIdAndDelete(id);
  res.status(200).json(new ApiResponse(200, 'Post deleted successfully', deletedPost));
};

// PUT api/post/:id
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { content } = req.body;

  if (!content) {
    throw ApiError.BAD_REQUEST('Content is required');
  }

  const post = await postModel.findById(id);

  if (!post) {
    throw ApiError.NOT_FOUND('Post not found');
  }

  if (userId !== post.author.toString()) {
    throw ApiError.FORBIDDEN('You are not authorized to update this post');
  }

  post.content = content;
  await post.save();

  res.status(200).json(new ApiResponse(200, 'Post updated successfully', post));
};
