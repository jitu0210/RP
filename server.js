import express from 'express';
import helmet from 'helmet';
import cors from "cors"
import connectDB from './config/database.js';
import config from './config/env.config.js';
import authRoutes from './routes/auth.js';
import analogRoutes from "./routes/analogRoutes.js"
import eventsRoutes from "./routes/eventsRoutes.js";
import { initializeUsers } from './controllers/authController.js';


const app = express();

app.use(cors({
  origin:'http://localhost:5173',
  credentials: true
}))

// Security middleware
app.use(helmet());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

connectDB();

// Initialize predefined users
initializeUsers();

app.use('/api/auth', authRoutes);
app.use('/api/analog', analogRoutes);
app.use("/api/events", eventsRoutes);


const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
