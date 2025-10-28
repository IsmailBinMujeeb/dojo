import { isValidObjectId } from 'mongoose';
import followerModel from '../models/follower.model.js';
import ApiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/apiError.js';

// POST api/follower/:followedToId
export const toggleFollower = async (req, res) => {
  const { followedToId } = req.params;
  const followedById = req.user._id;

  if (!isValidObjectId(followedToId)) {
    throw ApiError.BAD_REQUEST('Invalid followr id');
  }

  if (followedById === followedToId) {
    throw ApiError.CONFLICT('user can not follow him self');
  }

  const isFollowerExist = await followerModel.findOne({
    followedBy: followedById,
    followedTo: followedToId,
  });

  if (isFollowerExist) {
    const deletedFollower = await isFollowerExist.deleteOne();
    return res.status(200).json(new ApiResponse(200, 'Deleted follower', deletedFollower));
  } else {
    const newFollower = await followerModel.create({
      followedBy: followedById,
      followedTo: followedToId,
    });
    return res.status(201).json(new ApiResponse(201, 'Follower added', newFollower));
  }
};

// GET api/followers/:userId
export const getFollowers = async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const userId = req.params.userId;

  if (!isValidObjectId(userId)) {
    throw ApiError.BAD_REQUEST('Invalid user id');
  }

  const followers = await followerModel.paginate(
    { followedTo: userId },
    {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: [{ path: 'followedBy', select: 'username name avatar _id bio' }],
    }
  );

  return res.status(200).json(new ApiResponse(200, 'Followers retrieved', followers));
};

// GET api/following/:userId
export const getFollowing = async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const userId = req.params.userId;

  if (!isValidObjectId(userId)) {
    throw ApiError.BAD_REQUEST('Invalid user id');
  }

  const following = await followerModel.paginate(
    { followedBy: userId },
    {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: [{ path: 'followedTo', select: 'username name avatar _id bio' }],
    }
  );

  return res.status(200).json(new ApiResponse(200, 'Following retrieved', following));
};
