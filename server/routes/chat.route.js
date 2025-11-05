import { Router } from 'express';
import { createChat, getAllChats, getChat } from '../controllers/chat.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.post('/:requiestedUsedId', authMiddleware, asyncHandler(createChat));
router.get('/', authMiddleware, asyncHandler(getAllChats));
router.get('/:chatId', authMiddleware, asyncHandler(getChat));

export default router;
