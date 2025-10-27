import { Router } from 'express';
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from '../controllers/post.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';
const router = Router();

router.post('/', authMiddleware, asyncHandler(createPost));
router.get('/', authMiddleware, asyncHandler(getPosts));
router.get('/:id', authMiddleware, asyncHandler(getPost));
router.put('/:id', authMiddleware, asyncHandler(updatePost));
router.delete('/:id', authMiddleware, asyncHandler(deletePost));

export default router;
