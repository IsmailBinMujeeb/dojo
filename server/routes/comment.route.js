import { Router } from 'express';
import {
  createComment,
  deleteComment,
  getComment,
  updateComment,
} from '../controllers/comment.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.post('/:postId', authMiddleware, asyncHandler(createComment));
router.get('/:commentId', authMiddleware, asyncHandler(getComment));
router.put('/:commentId', authMiddleware, asyncHandler(updateComment));
router.delete('/:commentId', authMiddleware, asyncHandler(deleteComment));

export default router;
