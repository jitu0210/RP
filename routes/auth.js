import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, getProfile, protectedResource } from '../controllers/authController.js';
import { validateLogin } from '../middleware/validation.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import config from '../config/env.config.js';

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting to login requests
router.use('/login', authLimiter);

// Routes
router.post('/login', validateLogin, login);
router.get('/profile', authenticate, getProfile);
router.get('/protected', authenticate, protectedResource);

export default router;