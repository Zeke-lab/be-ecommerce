import { ZodIssue } from 'zod';
import { ErrorCodes } from '../constants/error-codes';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code: string;
  public userMessage: string;
  public error?: ZodIssue[];

  constructor(
    message: string,
    statusCode: number,
    code: string,
    userMessage: string,
    isOperational: boolean = true,
    error?: ZodIssue[],
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;
    this.userMessage = userMessage;
    this.error = error;

    Error.captureStackTrace(this);
  }
}

export class AuthenticationError extends AppError {
  constructor(details?: string) {
    const error = ErrorCodes.AUTHENTICATION_ERROR;
    super(
      details || error.message,
      error.statusCode,
      error.code,
      details || error.userMessage,
    );
  }
}

export class BadRequestError extends AppError {
  constructor(details?: string) {
    const error = ErrorCodes.BAD_REQUEST;
    super(
      details || error.message,
      error.statusCode,
      error.code,
      details || error.userMessage,
    );
  }
}

export class UnauthorizedError extends AppError {
  constructor(details?: string) {
    const error = ErrorCodes.UNAUTHORIZED;
    super(
      details || error.message,
      error.statusCode,
      error.code,
      details || error.userMessage,
    );
  }
}

export class ValidationError extends AppError {
  constructor(issue?: ZodIssue[]) {
    const error = ErrorCodes.VALIDATION_ERROR;
    super(
      error.message,
      error.statusCode,
      error.code,
      error.userMessage,
      true,
      issue,
    );
  }
}

export class InternalServerError extends AppError {
  constructor(details?: string) {
    const error = ErrorCodes.INTERNAL_SERVER_ERROR;
    super(
      details || error.message,
      error.statusCode,
      error.code,
      error.userMessage,
      false, // Non-operational error
    );
  }
}

export class NotFoundError extends AppError {
  constructor(details?: string) {
    const error = ErrorCodes.NOT_FOUND;
    super(
      details || error.message,
      error.statusCode,
      error.code,
      error.userMessage,
    );
  }
}

export class ConflictError extends AppError {
  constructor(details?: string) {
    const error = ErrorCodes.CONFLICT;
    super(
      details || error.message,
      error.statusCode,
      error.code,
      details || error.userMessage,
    );
  }
}
