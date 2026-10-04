import mongoose from 'mongoose';
import postModel from '../models/post.model.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import postDocsModel from '../models/post.docs.model.js';
import cloudinary from '../utils/cloudinary.js';
import postPollModel from '../models/post.poll.model.js';
import postPollOptionModel from '../models/post.poll.option.model.js';
import postPollOptionVoteModel from '../models/post.poll.option.vote.model.js';

// POST api/post
export const createPost = async (req, res) => {
  const { content } = req.body;
  const userId = req.user._id;
  const files = req.files;

  if (!content) {
    throw ApiError.BAD_REQUEST('Content is required');
  }

  const post = await postModel.create({ content, author: userId });
  const postId = post._id;

  if (!postId) return res.status(400).json(new ApiResponse(400, 'Failed to create post'));

  if (files) {
    if (files.images && Array.isArray(files.images)) {
      for (let img of files.images) {
        if (!img?.path) continue;
        const secureUrl = await cloudinary(img?.path);
        await postDocsModel.create({ url: secureUrl, postId, type: 'image' });
      }
    }
    if (files.documents && Array.isArray(files.documents)) {
      for (let doc of files.documents) {
        if (!doc?.path) continue;
        const secureUrl = await cloudinary(doc?.path);
        await postDocsModel.create({ url: secureUrl, postId, type: 'other' });
      }
    }
  }

  if (req.body?.poll) {
    const poll = JSON.parse(req.body.poll);

    if (poll?.options && Array.isArray(poll.options)) {
      const postPoll = await postPollModel.create({ postId });
      const pollId = postPoll._id;

      for (let opt of poll.options) {
        await postPollOptionModel.create({ text: opt, pollId });
      }
    }
  }
  res.status(201).json(new ApiResponse(201, 'Post created successfully', post));
};

// GET api/post/:id
export const getPost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id;

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
      $lookup: {
        from: 'postdocs',
        localField: '_id',
        foreignField: 'postId',
        as: 'images',
        pipeline: [
          {
            $match: {
              type: 'image',
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'postdocs',
        localField: '_id',
        foreignField: 'postId',
        as: 'documents',
        pipeline: [
          {
            $match: {
              type: 'other',
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
        from: 'comments',
        localField: '_id',
        foreignField: 'postId',
        as: 'comments',
        pipeline: [
          {
            $match: { parentComment: null },
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
        author: {
          _id: 1,
          username: 1,
          email: 1,
          name: 1,
          avatar: 1,
          bio: 1,
        },
        images: { url: 1 },
        documents: { url: 1 },
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
        from: 'likes',
        localField: '_id',
        foreignField: 'postId',
        as: 'likes',
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
        bookmarksCount: { $size: '$bookmarks' },
      },
    },
  ]);

  if (!post) {
    throw ApiError.NOT_FOUND('Post not found');
  }

  res.status(200).json(new ApiResponse(200, 'Post retrieved successfully', post));
};

// GET api/post
export const getPosts = async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const userId = req.user._id;

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
      $lookup: {
        from: 'postdocs',
        localField: '_id',
        foreignField: 'postId',
        as: 'images',
        pipeline: [
          {
            $match: {
              type: 'image',
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'postdocs',
        localField: '_id',
        foreignField: 'postId',
        as: 'documents',
        pipeline: [
          {
            $match: {
              type: 'other',
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
        from: 'postpolls',
        localField: '_id',
        foreignField: 'postId',
        as: 'poll',
        pipeline: [
          {
            $lookup: {
              from: 'postpolloptions',
              localField: '_id',
              foreignField: 'pollId',
              as: 'options',
              pipeline: [
                {
                  $lookup: {
                    from: 'postpolloptionvotes',
                    let: {
                      optionId: '$_id',
                    },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $eq: ['$optionId', '$$optionId'],
                          },
                        },
                      },
                    ],
                    as: 'votes',
                  },
                },
                {
                  $set: {
                    votesCount: { $size: '$votes' },

                    isVoted: {
                      $in: [new mongoose.Types.ObjectId(userId), '$votes.userId'],
                    },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    text: 1,
                    votesCount: 1,
                    isVoted: 1,
                  },
                },
              ],
            },
          },
          {
            $set: {
              totalVotes: {
                $sum: '$options.votesCount',
              },
            },
          },
          {
            $project: {
              _id: 0,
              options: 1,
              totalVotes: 1,
            },
          },
        ],
      },
    },
    {
      $set: {
        poll: {
          $arrayElemAt: ['$poll', 0],
        },
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
      $lookup: {
        from: 'bookmarks',
        localField: '_id',
        foreignField: 'postId',
        as: 'bookmarks',
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
        isLiked: {
          $in: [new mongoose.Types.ObjectId(userId), '$likes.userId'],
        },
        isBookmarked: {
          $in: [new mongoose.Types.ObjectId(userId), '$bookmarks.userId'],
        },
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

// POST /api/post/:PostID/vote
export const votePoll = async (req, res) => {
  const { id } = req.params;
  const { optionId } = req.body;
  const userId = req.user._id;

  if (!optionId) {
    throw ApiError.BAD_REQUEST('Option id is required');
  }

  const poll = await postPollModel.findOne({ postId: id });

  if (!poll) {
    throw ApiError.NOT_FOUND('Post not found');
  }

  const option = await postPollOptionModel.findOne({
    _id: optionId,
    pollId: poll._id,
  });

  if (!option) {
    throw ApiError.NOT_FOUND('Option not found');
  }

  // Get all options belonging to this poll
  const options = await postPollOptionModel.find({
    pollId: poll._id,
  });

  const optionIds = options.map((option) => option._id);

  // Remove user's previous vote in this poll
  await postPollOptionVoteModel.deleteMany({
    userId,
    optionId: { $in: optionIds },
  });

  // Create new vote
  const vote = await postPollOptionVoteModel.create({
    userId,
    optionId,
  });

  if (!vote) {
    throw ApiError.FORBIDDEN('Failed to vote');
  }

  // Get vote counts for all options
  const voteCounts = await postPollOptionVoteModel.aggregate([
    {
      $match: {
        optionId: { $in: optionIds },
      },
    },
    {
      $group: {
        _id: '$optionId',
        votesCount: { $sum: 1 },
      },
    },
  ]);

  // Convert counts into a Map for easy lookup
  const voteCountMap = new Map(voteCounts.map((item) => [item._id.toString(), item.votesCount]));

  const formattedOptions = options.map((option) => ({
    _id: option._id,
    text: option.text,
    votesCount: voteCountMap.get(option._id.toString()) || 0,
    isVoted: option._id.toString() === optionId.toString(),
  }));

  const totalVotes = formattedOptions.reduce((total, option) => total + option.votesCount, 0);

  return res.status(200).json(
    new ApiResponse(200, 'Voted successfully', {
      options: formattedOptions,
      totalVotes,
    }),
  );
};
