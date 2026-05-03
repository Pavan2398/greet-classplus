import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
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
  const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL
  ].filter(Boolean);

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));

  // Serve uploaded images as static
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Mount routes
  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/templates', templateRoutes);
  app.use('/api/image', imageRoutes);
  app.use('/api/subscription', subscriptionRoutes);

  // Root & Frontend serving in production
  if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.join(__dirname, '../client/dist');
    app.use(express.static(clientBuildPath));

    app.get('/*', (req, res) => {
      // Check if the request is for an API route - if not, serve the frontend
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(clientBuildPath, 'index.html'));
      }
    });
  } else {
    app.get('/', (req, res) => {
      res.send('Greetings App API is running (Development Mode)...');
    });
  }

  // Error Handling Middleware
  app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();
