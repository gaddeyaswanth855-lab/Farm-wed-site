import { Router } from 'express';
import { registerOrUpdateUser, getCurrentUserProfile } from '../../controllers/userController.js';
import { authenticateUser } from '../../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerOrUpdateUser);
router.get('/me', authenticateUser, getCurrentUserProfile);

export default router;
