import { Router } from 'express';
import { sendChatMessage, getChatHistory } from '../../controllers/chatController.js';
import { authenticateUser } from '../../middleware/authMiddleware.js';
import { aiRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.use(authenticateUser);

router.post('/message', aiRateLimiter, sendChatMessage);
router.get('/history', getChatHistory);

export default router;
