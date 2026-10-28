import { Router } from 'express';
import { getLatestMandiPrices, calculateArbitrage, calculateStorageBreakeven } from '../../controllers/mandiController.js';

const router = Router();

// Mandi rates are publicly readable without auth token
router.get('/latest', getLatestMandiPrices);
router.post('/arbitrage', calculateArbitrage);
router.post('/storage-breakeven', calculateStorageBreakeven);

export default router;
