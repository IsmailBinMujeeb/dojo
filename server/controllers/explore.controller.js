import userModel from '../models/user.model.js';
import ApiResponse from '../utils/apiResponse.js';

// GET api/explore/:search
export const explore = async (req, res) => {
  const { search } = req.params;

  const searchRegex = new RegExp(search, 'i');
  const users = await userModel.find({ $or: [{ username: searchRegex }, { name: searchRegex }] });

  return res.status(200).json(new ApiResponse(200, 'Users retrieved successfully', users));
};
