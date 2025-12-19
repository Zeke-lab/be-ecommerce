import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/errors';
import logger from '../logger';
import { ENV } from '../env';

const errorHandler = (
  error: AppError,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Log the error details for debugging
  if (res.headersSent) {
    return next(error);
  }

  res.locals.isErrorResponse = true;

  logger.error(
    `Error Code: ${error.code}, Message: ${error.message}, Stack: ${error.stack}`,
  );

  return res.status(error.statusCode || 500).json({
    code: error.code,
    error: error.error,
    message: error.userMessage,
    'stack[FOR LOCAL USE ONLY]':
      ENV.NODE_ENV === 'local' ? error.stack : undefined,
    status: 'ERROR',
  });
};

export default errorHandler;
