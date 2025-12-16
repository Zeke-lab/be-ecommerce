import express from 'express';
import logger from './logger';
import { ENV } from './env';

logger.info('Application is starting...');

const app = express();

app.get('/', (_, res) => {
  res.send('Hello TypeScript + Express');
});

app.listen(ENV.PORT, () => {
  logger.verbose(
    `ENV is pointing to ${
      ENV.NODE_ENV !== 'production'
        ? JSON.stringify(ENV, undefined, 2)
        : ENV.NODE_ENV
    }`,
  );

  logger.info(`Server is running on http://localhost:${ENV.PORT}`);
});
