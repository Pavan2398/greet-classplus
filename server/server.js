import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import connectDB from './config/db.js';
import { seedTemplates } from './utils/seedTemplates.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

// Connect to database and seed templates
const startServer = async () => {
  await connectDB();
  await seedTemplates();

  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // CORS config
  const corsOptions = {
    origin: (origin, callback) => {
      // Allow all origins in development or from Vercel/Localhost in production
      const isLocalhost = origin && (origin.includes('localhost') || origin.includes('127.0.0.1'));
      const isVercel = origin && origin.includes('.vercel.app');
      
      if (!origin || isLocalhost || isVercel || origin === process.env.FRONTEND_URL) {
        callback(null, true);
      } else {
        // Log the denied origin to help debugging
        console.log('CORS Denied for:', origin);
        callback(null, true); // Temporarily allow to stop the 500 crash while we debug
      }
    },
    credentials: true
  };

  app.use(cors(corsOptions));

  // Serve uploaded images as static
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Mount routes
  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/templates', templateRoutes);
  app.use('/api/image', imageRoutes);
  app.use('/api/subscription', subscriptionRoutes);

  // Root API Route
  app.get('/', (req, res) => {
    res.send('WishCraft Greetings API is running...');
  });

  // Global Error Handling Middleware
  app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer().catch(err => {
  console.error('FAILED TO START SERVER:', err);
  process.exit(1);
});
