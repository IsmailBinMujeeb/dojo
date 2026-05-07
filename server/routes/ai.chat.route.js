import { Router } from 'express';
import { createAiChat, getAiChat, getAiChats } from '../controllers/ai.chat.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import asyncHandler from '../middlewares/asyncHandler.js';

const router = Router();

router.post('/create', authMiddleware, asyncHandler(createAiChat));
router.get('/:id', authMiddleware, asyncHandler(getAiChat));
router.get('/', authMiddleware, asyncHandler(getAiChats));

export default router;
