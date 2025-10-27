import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';

export default async (req, res, next) => {
  try {
    const incomingAccessToken =
      req.cookies['accessToken'] || req.headers['authorization']?.split(' ')?.[1];

    console.log(req.cookies['accessToken']);

    if (!incomingAccessToken) throw ApiError.UNAUTHORIZED('missing access token');

    const decoded = jwt.verify(incomingAccessToken, env.ACCESS_TOKEN_SECRET);

    if (!decoded || !decoded._id) throw ApiError.UNAUTHORIZED('token invalid or already used');

    req.user = {
      _id: decoded._id,
    };

    next();
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json(ApiError.UNAUTHORIZED('access token expired'));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json(ApiError.BAD_REQUEST(error.message || 'invalid access token'));
    }

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode || 500)
        .json(new ApiResponse(error.statusCode || 500, error.message));
    }
    return res
      .status(500)
      .json(ApiError.INTERNAL_SERVER_ERROR(error.message || `Internal Server Error`));
  }
};
