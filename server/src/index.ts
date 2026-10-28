import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { db } from './config/db.js';
import v1Router from './routes/v1/index.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Permit frontend communication
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: (origin, callback) => {
    // Permit local development or matched CORS_ORIGIN
    callback(null, true);
  },
  credentials: true
}));

// Payload Limit (10mb for base64 leaf/crop pest photo uploads)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'KisanSeva AI Agronomic Core',
    geminiConfigured: Boolean(env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim() !== '')
  });
});

// API Routes
app.use('/api/v1', v1Router);

// Global Error Handler
app.use(errorHandler);

// Server Startup
async function startServer() {
  try {
    await db.init();
    
    const server = app.listen(env.PORT, () => {
      console.log(`🌾 KisanSeva AI Agronomic Engine running on port ${env.PORT} [${env.NODE_ENV}]`);
      console.log(`🚜 API Endpoints mounted at http://localhost:${env.PORT}/api/v1`);
      console.log(`🩺 Health check accessible at http://localhost:${env.PORT}/health`);
    });

    const gracefulShutdown = () => {
      console.log('Received termination signal, gracefully shutting down KisanSeva server...');
      server.close(() => {
        console.log('KisanSeva HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (error) {
    console.error('Fatal failure initializing KisanSeva server:', error);
    process.exit(1);
  }
}

startServer();
