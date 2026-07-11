import express from 'express';
import { getAllDevelopers, getDeveloperById, updateProfile } from '../controllers/developerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllDevelopers);
router.get('/:id', getDeveloperById);
router.put('/profile', protect, updateProfile);

export default router;
