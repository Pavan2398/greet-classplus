import express from 'express';
import { generateImage } from '../controllers/imageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateImage);

export default router;
