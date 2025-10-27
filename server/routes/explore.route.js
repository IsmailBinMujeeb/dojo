import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { explore } from '../controllers/explore.controller.js';

const router = Router();

router.get('/:search', authMiddleware, explore);

export default router;
