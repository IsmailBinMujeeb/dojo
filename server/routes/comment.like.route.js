import { Router } from 'express';
import { getLikes, toggleLike } from '../controllers/comment.like.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.post('/:commentId', authMiddleware, asyncHandler(toggleLike));
router.get('/', authMiddleware, asyncHandler(getLikes));

export default router;
