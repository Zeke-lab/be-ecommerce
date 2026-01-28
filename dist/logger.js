"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const env_1 = require("./env");
const config_1 = require("winston/lib/winston/config");
const { combine, timestamp, label, printf, json } = winston_1.format;
const customFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});
const errorFileTransport = new winston_daily_rotate_file_1.default({
    datePattern: 'DD-MM-YYYY',
    filename: 'logs/error-%DATE%.log',
    level: 'error',
    format: winston_1.format.uncolorize(),
    handleExceptions: true,
    handleRejections: true,
    maxFiles: '14d',
});
const logsFileTransport = new winston_daily_rotate_file_1.default({
    datePattern: 'DD-MM-YYYY',
    filename: 'logs/logs-%DATE%.log',
    level: 'info',
    format: winston_1.format.uncolorize(),
    maxFiles: '14d',
});
const logger = (0, winston_1.createLogger)({
    defaultMeta: { service: env_1.ENV.APP },
    format: combine(env_1.ENV.NODE_ENV !== 'production' ? winston_1.format.colorize() : winston_1.format.uncolorize(), label({ label: env_1.ENV.APP }), timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }), json(), customFormat),
    level: 'verbose',
    levels: config_1.npm.levels,
    transports: [
        errorFileTransport,
        logsFileTransport,
        new winston_1.transports.Console({ handleExceptions: true, handleRejections: true }),
    ],
});
exports.default = logger;
