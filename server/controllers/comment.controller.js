import { isValidObjectId } from 'mongoose';
import commentModel from '../models/comment.model.js';
import ApiError from '../utils/apiError.js';
import postModel from '../models/post.model.js';
import ApiResponse from '../utils/apiResponse.js';
import mongoose from 'mongoose';
import { notificationQueue } from '../queues/notification.queue.js';

// POST api/comment/:postId
export const createComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const parentCommentId = req.query.parentCommentId;
  const userId = req.user._id;

  if (!content) {
    throw ApiError.BAD_REQUEST('Content is required');
  }

  if (!isValidObjectId(postId)) {
    throw ApiError.BAD_REQUEST('Invalid post ID');
  }

  const post = await postModel.findById(postId);
  if (!post) {
    throw ApiError.NOT_FOUND('Post not found');
  }

  const comment = new commentModel({
    content,
    userId,
    postId,
  });

  if (parentCommentId) {
    if (!isValidObjectId(parentCommentId)) {
      throw ApiError.BAD_REQUEST('Invalid parent comment id');
    }

    const parentComment = await commentModel.findById(parentCommentId);

    if (!parentComment) {
      throw ApiError.NOT_FOUND('Parent comment not found');
    }

    if (parentComment.postId.toString() !== postId) {
      throw ApiError.BAD_REQUEST('Parent comment does not belong to this post');
    }

    comment.parentComment = parentCommentId;
  }
  await comment.save();

  await notificationQueue.add('notification', {
    type: 'comment',
    userId: userId,
    commentId: comment._id,
  });

  return res.status(201).json(new ApiResponse(201, 'Comment created successfully', comment));
};

// GET api/comment/:commentId
export const getComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user?._id;

  const [comment] = await commentModel.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(commentId) },
    },
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
              isLiked: {
                $in: [new mongoose.Types.ObjectId(userId), '$likes.userId'],
              },
              commentsCount: { $size: '$comments' },
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        postId: 1,
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
            userId: 1,
            commentId: 1,
          },
          isLiked: 1,
          likesCount: 1,
          createdAt: 1,
        },
        createdAt: 1,
        updatedAt: 1,
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
      },
    },
  ]);

  if (!comment) {
    throw ApiError.NOT_FOUND('Comment not found');
  }

  return res.status(200).json(new ApiResponse(200, 'Comment retrieved successfully', comment));
};

// PUT api/comment/:commentId
export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!content) {
    throw ApiError.BAD_REQUEST('Content is required');
  }

  const comment = await commentModel.findById(commentId);
  if (!comment) {
    throw ApiError.NOT_FOUND('Comment not found');
  }

  if (userId !== comment.userId.toString()) {
    throw ApiError.FORBIDDEN('You are not authorized to update this comment');
  }

  comment.content = content;
  await comment.save();

  return res.status(200).json(new ApiResponse(200, 'Comment updated successfully', comment));
};

// DELETE api/comment/:commentId
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const comment = await commentModel.findById(commentId);
  if (!comment) {
    throw ApiError.NOT_FOUND('Comment not found');
  }

  if (userId.toString() !== comment.userId.toString()) {
    throw ApiError.FORBIDDEN('You are not authorized to delete this comment');
  }

  const deletedComment = await commentModel.findByIdAndDelete(commentId);

  return res.status(200).json(new ApiResponse(200, 'Comment deleted successfully', deletedComment));
};
