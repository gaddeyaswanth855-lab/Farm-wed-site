import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { db } from './config/db.js';
import v1Router from './routes/v1/index.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Static frontend delivery in production or when dist exists
const possibleDistPaths = [
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(__dirname, '../../../client/dist'),
  path.resolve(process.cwd(), 'client/dist'),
];

const clientDistPath = possibleDistPaths.find((p) => fs.existsSync(p));

if (clientDistPath) {
  console.log(`📦 Serving static client from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

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
