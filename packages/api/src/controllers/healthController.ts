import { Request, Response } from 'express';
import { checkDatabaseConnection } from '../utils/prisma.js';

interface HealthResponse {
  status: 'ok' | 'degraded';
  timestamp: string;
  version: string;
  database: 'connected' | 'disconnected';
}

export async function healthCheck(_req: Request, res: Response): Promise<void> {
  const dbConnected = await checkDatabaseConnection();

  const response: HealthResponse = {
    status: dbConnected ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    database: dbConnected ? 'connected' : 'disconnected',
  };

  const statusCode = dbConnected ? 200 : 503;
  res.status(statusCode).json(response);
}
