import helmet from 'helmet';
import cors from 'cors';
import { Express } from 'express';

export function setupSecurityMiddleware(app: Express) {
  // Helmet security headers
  app.use(helmet({
    contentSecurityPolicy: false, // Customized on client side
    crossOriginEmbedderPolicy: false,
  }));

  // Flexible CORS configuration for Vercel + Local development
  const clientOriginEnv = process.env.CLIENT_ORIGIN;

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, uptime monitors, server-to-server)
      if (!origin) return callback(null, true);

      if (!clientOriginEnv || clientOriginEnv === '*') {
        return callback(null, true);
      }

      const allowedOrigins = clientOriginEnv.split(',').map(s => s.trim().replace(/\/$/, ''));
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }

      // Automatically allow Vercel production and preview deployments
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      // Default allow
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));
}
