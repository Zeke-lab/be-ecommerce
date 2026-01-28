"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.NotFoundError = exports.InternalServerError = exports.ValidationError = exports.UnauthorizedError = exports.BadRequestError = exports.AuthenticationError = exports.AppError = void 0;
const error_codes_1 = require("../constants/error-codes");
class AppError extends Error {
    statusCode;
    isOperational;
    code;
    userMessage;
    error;
    constructor(message, statusCode, code, userMessage, isOperational = true, error) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.code = code;
        this.userMessage = userMessage;
        this.error = error;
        Error.captureStackTrace(this);
    }
}
exports.AppError = AppError;
class AuthenticationError extends AppError {
    constructor(details) {
        const error = error_codes_1.ErrorCodes.AUTHENTICATION_ERROR;
        super(details || error.message, error.statusCode, error.code, details || error.userMessage);
    }
}
exports.AuthenticationError = AuthenticationError;
class BadRequestError extends AppError {
    constructor(details) {
        const error = error_codes_1.ErrorCodes.BAD_REQUEST;
        super(details || error.message, error.statusCode, error.code, details || error.userMessage);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends AppError {
    constructor(details) {
        const error = error_codes_1.ErrorCodes.UNAUTHORIZED;
        super(details || error.message, error.statusCode, error.code, details || error.userMessage);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ValidationError extends AppError {
    constructor(issue) {
        const error = error_codes_1.ErrorCodes.VALIDATION_ERROR;
        super(error.message, error.statusCode, error.code, error.userMessage, true, issue);
    }
}
exports.ValidationError = ValidationError;
class InternalServerError extends AppError {
    constructor(details) {
        const error = error_codes_1.ErrorCodes.INTERNAL_SERVER_ERROR;
        super(details || error.message, error.statusCode, error.code, error.userMessage, false);
    }
}
exports.InternalServerError = InternalServerError;
class NotFoundError extends AppError {
    constructor(details) {
        const error = error_codes_1.ErrorCodes.NOT_FOUND;
        super(details || error.message, error.statusCode, error.code, error.userMessage);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(details) {
        const error = error_codes_1.ErrorCodes.CONFLICT;
        super(details || error.message, error.statusCode, error.code, details || error.userMessage);
    }
}
exports.ConflictError = ConflictError;
