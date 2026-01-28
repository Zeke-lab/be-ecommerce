"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodes = void 0;
exports.ErrorCodes = {
    UNAUTHORIZED: {
        code: 'BE-ECOMMERCE-40101',
        message: 'Unauthorized access.',
        statusCode: 401,
        userMessage: 'You are not authorized to perform this action.',
    },
    AUTHENTICATION_ERROR: {
        code: 'BE-ECOMMERCE-40102',
        message: 'Authentication failed.',
        statusCode: 401,
        userMessage: 'Authentication failed. Please check your credentials.',
    },
    BAD_REQUEST: {
        code: 'BE-ECOMMERCE-40001',
        message: 'Bad request.',
        statusCode: 400,
        userMessage: 'The request could not be understood by the server.',
    },
    CONFLICT: {
        code: 'BE-ECOMMERCE-40901',
        message: 'Conflict occurred.',
        statusCode: 409,
        userMessage: 'There is a conflict with the current state of the resource.',
    },
    INTERNAL_SERVER_ERROR: {
        code: 'BE-ECOMMERCE-50001',
        message: 'Internal server error.',
        statusCode: 500,
        userMessage: 'An unexpected error occurred. Please try again later.',
    },
    NOT_FOUND: {
        code: 'BE-ECOMMERCE-40401',
        message: 'Resource not found.',
        statusCode: 404,
        userMessage: 'The requested resource could not be found.',
    },
    VALIDATION_ERROR: {
        code: 'BE-ECOMMERCE-40002',
        message: 'Validation failed.',
        statusCode: 400,
        userMessage: 'Some of the provided data is invalid.',
    },
};
