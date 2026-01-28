"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
const env_1 = require("../env");
const errorHandler = (error, _req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.locals.isErrorResponse = true;
    logger_1.default.error(`Error Code: ${error.code}, Message: ${error.message}, Stack: ${error.stack}`);
    return res.status(error.statusCode || 500).json({
        code: error.code,
        error: error.error,
        message: error.userMessage,
        'stack[FOR LOCAL USE ONLY]': env_1.ENV.NODE_ENV === 'local' ? error.stack : undefined,
        status: 'ERROR',
    });
};
exports.default = errorHandler;
