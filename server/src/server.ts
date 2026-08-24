import express from 'express';
import dotenv from 'dotenv';
import { setupSecurityMiddleware } from './middleware/security';
import { apiRateLimiter } from './middleware/rateLimiter';
import contactRouter from './routes/contact';
import statsRouter from './routes/stats';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for Render / Cloud hosting rate limiting
app.set('trust proxy', 1);

// Middleware
app.use(express.json());
setupSecurityMiddleware(app);
app.use('/api', apiRateLimiter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/contact', contactRouter);
app.use('/api/stats', statsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Dharmik Tarasaka Backend API running on port ${PORT}`);
});

export default app;
