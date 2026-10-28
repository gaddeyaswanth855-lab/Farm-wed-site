import { Router } from 'express';
import { calculateFertilizerPlan } from '../../controllers/soilController.js';
import { authenticateUser } from '../../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateUser);

router.post('/fertilizer-plan', calculateFertilizerPlan);

export default router;
