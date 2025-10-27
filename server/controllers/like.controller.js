import likeModel from '../models/like.model.js';
import ApiResponse from '../utils/apiResponse.js';

// POST api/like/:postId
export const toggleLike = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const existingLike = await likeModel.findOne({ postId, userId });

  if (existingLike) {
    const deletedLike = await existingLike.deleteOne();
    return res.status(200).json(new ApiResponse(200, 'Deleted like', deletedLike));
  } else {
    const newLike = await likeModel.create({ postId, userId });
    return res.status(201).json(new ApiResponse(201, 'Like added', newLike));
  }
};

// GET api/like
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
