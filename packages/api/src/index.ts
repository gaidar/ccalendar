import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { connectDatabase, disconnectDatabase } from './utils/prisma.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { sanitizeInput } from './middleware/sanitize.js';
import { globalRateLimiter } from './middleware/rateLimit.js';
import { passport, configurePassport } from './config/passport.js';
import { initSentry, Sentry } from './utils/sentry.js';
import { disconnectRedis, getRedisClient } from './utils/redis.js';
import routes from './routes/index.js';

// Initialize Sentry before creating the app
initSentry();

const app = express();

// Security middleware with comprehensive configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", config.frontend.url],
        fontSrc: ["'self'", 'https:', 'data:'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    crossOriginEmbedderPolicy: false, // Allow OAuth providers
  })
);

// CORS configuration
const allowedOrigins = [
  config.frontend.url,
  ...(config.env === 'development' ? ['http://localhost:3000', 'http://127.0.0.1:3000'] : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    maxAge: 86400, // 24 hours preflight cache
  })
);

// Cookie parser for refresh tokens
app.use(cookieParser());

// Initialize Passport for OAuth
configurePassport();
app.use(passport.initialize());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitizeInput);

// Request logging
app.use(requestLogger);

// Global rate limiting
app.use('/api/v1', globalRateLimiter);

// API routes
app.use('/api/v1', routes);

// 404 handler
app.use(notFoundHandler);

// Sentry error handler (must be before our error handler)
if (config.sentry.isConfigured) {
  Sentry.setupExpressErrorHandler(app);
}

// Error handler
app.use(errorHandler);

// Graceful shutdown
async function shutdown(signal: string): Promise<void> {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  try {
    await Promise.all([
      disconnectDatabase(),
      disconnectRedis(),
    ]);
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Start server
async function start(): Promise<void> {
  try {
    await connectDatabase();

    // Initialize Redis connection (non-blocking)
    getRedisClient();

    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.env} mode`);
      logger.info(`Health check: http://localhost:${config.port}/api/v1/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
