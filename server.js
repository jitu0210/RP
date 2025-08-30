import express from 'express';
import helmet from 'helmet';
import connectDB from './config/database.js';
import config from './config/env.config.js';
import authRoutes from './routes/auth.js';
import { initializeUsers } from './controllers/authController.js';

const app = express();

// Security middleware
app.use(helmet());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

connectDB();

// Initialize predefined users
initializeUsers();

app.use('/api/auth', authRoutes);


const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
