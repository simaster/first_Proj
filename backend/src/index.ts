import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDatabase, disconnectDatabase } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimit';
import authRoutes from './routes/authRoutes';
import enterpriseRoutes from './routes/enterpriseRoutes';
import machineRoutes from './routes/machineRoutes';
import monitoringRoutes from './routes/monitoringRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/enterprises', enterpriseRoutes);
app.use('/api/v1/machines', machineRoutes);
app.use('/api/v1/monitoring', monitoringRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

startServer();
