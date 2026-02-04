import { Router } from 'express';
import authRouter from './auth/auth';
import exampleRouter from './example/example';
import categoryRouter from './category/category';

const gateway = Router();

gateway.use('/auth', authRouter);
gateway.use('/example', exampleRouter);
gateway.use('/categories', categoryRouter);

export default gateway;
