import { Router } from 'express';
import {
  deleteUser,
  loginUser,
  logoutUser,
  me,
  getUserByUsername,
  getRecentUsers,
  getUsersPost,
  refreshAccessToken,
  registerUser,
  updateUser,
} from '../controllers/user.controller.js';
import upload from '../middleware/multer.middleware.js';
import authMiddleware from '../middleware/auth.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));
router.post('/logout', authMiddleware, asyncHandler(logoutUser));
router.post('/refresh', asyncHandler(refreshAccessToken));
router.get('/me', authMiddleware, asyncHandler(me));
router.get('/profile/:username', authMiddleware, asyncHandler(getUserByUsername));
router.get('/get-recent-users', authMiddleware, asyncHandler(getRecentUsers));
router.get('/posts/:userId', authMiddleware, asyncHandler(getUsersPost));
router.put(
  '/',
  authMiddleware,
  upload.fields([{ name: 'avatar' }, { name: 'coverPhoto' }]),
  asyncHandler(updateUser)
);
router.delete('/', authMiddleware, asyncHandler(deleteUser));

export default router;
