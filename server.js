import express from 'express';
import helmet from 'helmet';
import connectDB from './config/database.js';
import config from './config/env.config.js';
import authRoutes from './routes/auth.js';
import { initializeUsers } from './controllers/authController.js';

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// Body parser middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Database connection
connectDB();

// Initialize predefined users
initializeUsers();

// Routes
app.use('/api/auth', authRoutes);


// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
