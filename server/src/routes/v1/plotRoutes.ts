import { Router } from 'express';
import { getUserPlots, createPlot, deletePlot } from '../../controllers/plotController.js';
import { authenticateUser } from '../../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateUser);

router.get('/', getUserPlots);
router.post('/', createPlot);
router.delete('/:id', deletePlot);

export default router;
