import likeModel from '../models/comment.like.model.js';
import ApiResponse from '../utils/apiResponse.js';

// POST api/comment-like/:commentId
export const toggleLike = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const existingLike = await likeModel.findOne({ commentId, userId });

  if (existingLike) {
    const deletedLike = await existingLike.deleteOne();
    return res.status(200).json(new ApiResponse(200, 'Deleted like', deletedLike));
  } else {
    const newLike = await likeModel.create({ commentId, userId });
    return res.status(201).json(new ApiResponse(201, 'Like added', newLike));
  }
};

// GET api/comment-like
export const getLikes = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user._id;

  const likes = await likeModel.paginate(
    { userId },
    {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: { path: 'user', select: 'username name avatar _id' },
    }
  );

  return res.status(200).json(new ApiResponse(200, 'Likes retrieved', likes));
};
