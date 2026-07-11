import express from 'express';
import { registerDeveloper, loginDeveloper, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerDeveloper);
router.post('/login', loginDeveloper);
router.get('/me', protect, getMe);

export default router;
