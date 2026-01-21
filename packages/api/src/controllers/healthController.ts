import { Request, Response } from 'express';
import { checkDatabaseConnection } from '../utils/prisma.js';
import { isRedisAvailable } from '../utils/redis.js';
import { config } from '../config/index.js';

const startTime = Date.now();

interface HealthResponse {
  status: 'ok' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  services: {
    database: 'connected' | 'disconnected';
    redis: 'connected' | 'disconnected' | 'not_configured';
  };
}

export async function healthCheck(_req: Request, res: Response): Promise<void> {
  const dbConnected = await checkDatabaseConnection();
  const redisConnected = isRedisAvailable();
  const redisConfigured = !!config.redis.url;

  // Determine overall status
  let status: 'ok' | 'degraded' | 'unhealthy' = 'ok';
  if (!dbConnected) {
    status = 'unhealthy';
  } else if (redisConfigured && !redisConnected) {
    status = 'degraded';
  }

  const response: HealthResponse = {
    status,
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || process.env.npm_package_version || '1.0.0',
    environment: config.env,
    uptime: Math.floor((Date.now() - startTime) / 1000),
    services: {
      database: dbConnected ? 'connected' : 'disconnected',
      redis: redisConfigured
        ? (redisConnected ? 'connected' : 'disconnected')
        : 'not_configured',
    },
  };

  const statusCode = status === 'ok' ? 200 : status === 'degraded' ? 200 : 503;
  res.status(statusCode).json(response);
}
