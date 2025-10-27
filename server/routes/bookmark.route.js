import { Router } from 'express';
import { getBookmarks, toggleBookmark } from '../controllers/bookmark.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.post('/:postId', authMiddleware, asyncHandler(toggleBookmark));
router.get('/', authMiddleware, asyncHandler(getBookmarks));

export default router;
