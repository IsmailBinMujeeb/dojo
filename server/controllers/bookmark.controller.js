import mongoose from 'mongoose';
import bookmarkModel from '../models/bookmark.model.js';
import ApiResponse from '../utils/apiResponse.js';

// POST api/bookmark/:postId
export const toggleBookmark = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const isBookmarkExist = await bookmarkModel.findOne({ postId, userId });

  if (isBookmarkExist) {
    const deletedBookmark = await isBookmarkExist.deleteOne();
    return res.status(200).json(new ApiResponse(200, 'Deleted bookmark', deletedBookmark));
  } else {
    const newBookmark = await bookmarkModel.create({ postId, userId });
    return res.status(201).json(new ApiResponse(201, 'Bookmark added', newBookmark));
  }
};

// GET api/bookmark
export const getBookmarks = async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const userId = req.user._id;

  const skip = (page - 1) * limit;
  const bookmarks = await bookmarkModel.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $sort: { createdAt: -1 } },
    { $limit: limit },
    { $skip: skip },
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
              isLiked: { $in: [new mongoose.Types.ObjectId(userId), '$likes.userId'] },
              isBookmarked: true,
            },
          },
        ],
      },
    },
    {
      $unwind: '$post',
    },
  ]);

  return res.status(200).json(new ApiResponse(200, 'Bookmarks retrieved', bookmarks));
};
