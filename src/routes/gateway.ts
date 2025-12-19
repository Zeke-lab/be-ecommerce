import { Router } from 'express';
import authRouter from './auth/auth';

const gateway = Router();

gateway.use('/auth', authRouter);

export default gateway;
