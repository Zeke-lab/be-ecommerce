import { Router } from 'express';
import authRouter from './auth/auth';
import exampleRouter from './example/example';

const gateway = Router();

gateway.use('/auth', authRouter);
gateway.use('/example', exampleRouter);

export default gateway;
