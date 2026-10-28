import { Router } from 'express';
import userRoutes from './userRoutes.js';
import plotRoutes from './plotRoutes.js';
import advisoryRoutes from './advisoryRoutes.js';
import pestRoutes from './pestRoutes.js';
import soilRoutes from './soilRoutes.js';
import mandiRoutes from './mandiRoutes.js';
import schemesRoutes from './schemesRoutes.js';
import chatRoutes from './chatRoutes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/plots', plotRoutes);
router.use('/advisories', advisoryRoutes);
router.use('/pest', pestRoutes);
router.use('/soil', soilRoutes);
router.use('/mandi', mandiRoutes);
router.use('/schemes', schemesRoutes);
router.use('/chat', chatRoutes);

export default router;
