import 'dotenv/config';
import express from 'express';
import logger from './logger';
import { ENV } from './env';
import errorHandler from './middlewares/error-handler';
import gateway from './routes/gateway';
import { listRoutes } from './utils/list-routes';
import { NotFoundError } from './utils/errors';
import cookieParser from 'cookie-parser';
import cors from 'cors';

logger.info('Application is starting...');

const app = express();

logger.info('Setting up middlewares...');
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  }),
);

app.use(gateway);

app.use((_req, _res, next) => {
  return next(new NotFoundError('Route not found'));
});

app.use(errorHandler);

app.listen(ENV.PORT, () => {
  logger.verbose(
    `ENV is pointing to ${
      ENV.NODE_ENV !== 'production'
        ? JSON.stringify(ENV, undefined, 2)
        : ENV.NODE_ENV
    }`,
  );

  listRoutes(app).forEach((route) => {
    logger.verbose(`${route.method} ${route.path}`);
  });

  logger.info(`Server is running on http://localhost:${ENV.PORT}`);
});
