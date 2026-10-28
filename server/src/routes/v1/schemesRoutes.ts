import { Router } from 'express';
import { matchFarmerSchemes } from '../../controllers/schemesController.js';
import { authenticateUser } from '../../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateUser);

router.get('/match', matchFarmerSchemes);

export default router;
