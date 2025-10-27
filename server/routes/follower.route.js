import { Router } from 'express';
import { getFollowers, getFollowing, toggleFollower } from '../controllers/follower.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/followers/:userId', authMiddleware, asyncHandler(getFollowers));
router.get('/following/:userId', authMiddleware, asyncHandler(getFollowing));
router.post('/follower/:followedToId', authMiddleware, asyncHandler(toggleFollower));

export default router;
