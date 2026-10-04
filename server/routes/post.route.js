import { Router } from 'express';
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
  votePoll,
} from '../controllers/post.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';
import multerMiddleware from '../middleware/multer.middleware.js';
const router = Router();

router.post(
  '/',
  authMiddleware,
  multerMiddleware.fields([{ name: 'images' }, { name: 'documents' }]),
  asyncHandler(createPost),
);
router.get('/', authMiddleware, asyncHandler(getPosts));
router.get('/:id', authMiddleware, asyncHandler(getPost));
router.put('/:id', authMiddleware, asyncHandler(updatePost));
router.delete('/:id', authMiddleware, asyncHandler(deletePost));
router.post('/:id/vote', authMiddleware, asyncHandler(votePoll));

export default router;
