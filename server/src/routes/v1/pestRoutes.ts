import { Router } from 'express';
import { diagnosePest, getPestHistory } from '../../controllers/pestController.js';
import { authenticateUser } from '../../middleware/authMiddleware.js';
import { aiRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.use(authenticateUser);

router.post('/diagnose', aiRateLimiter, diagnosePest);
router.get('/history', getPestHistory);

export default router;
