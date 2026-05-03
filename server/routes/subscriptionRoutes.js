import express from 'express';
import { subscribe, getSubscriptionStatus } from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/subscribe', protect, subscribe);
router.get('/status', protect, getSubscriptionStatus);

export default router;
