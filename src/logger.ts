/*
    - "winston" logger
    - winston-daily-rotate-file for log rotation


    Custom Log Format:

    10.12.245245 [label] [level]: message


    be-ecommerce - [verbose]: Server started on port 3000

    be-ecommerce - [info]: User logged in

*/

import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ENV } from './env';
import { npm } from 'winston/lib/winston/config';

const { combine, timestamp, label, printf, json } = format;

const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const errorFileTransport: DailyRotateFile = new DailyRotateFile({
  datePattern: 'DD-MM-YYYY',
  filename: 'logs/error-%DATE%.log',
  level: 'error',
  format: format.uncolorize(),
  handleExceptions: true,
  handleRejections: true,
  maxFiles: '14d', // Keep logs for 14 days
});

const logsFileTransport: DailyRotateFile = new DailyRotateFile({
  datePattern: 'DD-MM-YYYY',
  filename: 'logs/logs-%DATE%.log',
  level: 'info',
  format: format.uncolorize(),
  maxFiles: '14d', // Keep logs for 14 days
});

const logger = createLogger({
  defaultMeta: { service: ENV.APP },
  format: combine(
    ENV.NODE_ENV !== 'production' ? format.colorize() : format.uncolorize(),
    label({ label: ENV.APP }),
    timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
    json(),
    customFormat,
  ),
  level: 'verbose',
  levels: npm.levels,
  transports: [
    errorFileTransport,
    logsFileTransport,
    new transports.Console({ handleExceptions: true, handleRejections: true }),
  ],
});

export default logger;
