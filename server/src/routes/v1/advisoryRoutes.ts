import { Router } from 'express';
import { generateCropPlan, getAdvisoryHistory } from '../../controllers/advisoryController.js';
import { authenticateUser } from '../../middleware/authMiddleware.js';
import { aiRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.use(authenticateUser);

router.post('/crop-plan', aiRateLimiter, generateCropPlan);
router.get('/history', getAdvisoryHistory);

export default router;
