import express from 'express';
import {
  registerUser,
  loginUser,
  loginGuest,
  logoutUser,
  refresh,
  getMe,
  googleLogin,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/guest', loginGuest);
router.post('/logout', logoutUser);
router.get('/refresh', refresh);
router.get('/me', protect, getMe);

export default router;
