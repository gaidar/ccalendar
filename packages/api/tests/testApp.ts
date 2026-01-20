import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler, notFoundHandler } from '../src/middleware/errorHandler.js';
import routes from '../src/routes/index.js';

export function createTestApp() {
  const app = express();

  // Middleware
  app.use(cors({ credentials: true }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Trust proxy for IP extraction in tests
  app.set('trust proxy', true);

  // Routes
  app.use('/api/v1', routes);

  // Error handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
