import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';

/**
 * Express middleware to log HTTP requests
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log request
  logger.http(`${req.method} ${req.url}`);
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.url} ${res.statusCode} - ${duration}ms`;
    
    if (res.statusCode >= 500) {
      logger.error(message);
    } else if (res.statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.http(message);
    }
  });
  
  next();
};

/**
 * Error logging middleware
 */
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`);
  logger.error(`Stack: ${err.stack}`);
  logger.error(`Path: ${req.method} ${req.url}`);
  logger.error(`Body: ${JSON.stringify(req.body)}`);
  
  next(err);
};
