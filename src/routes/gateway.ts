import { Router } from 'express';
import authRouter from './auth/auth';
import exampleRouter from './example/example';
import categoryRouter from './category/category';
import productRouter from './product/product';

const gateway = Router();

gateway.use('/auth', authRouter);
gateway.use('/example', exampleRouter);
gateway.use('/categories', categoryRouter);
gateway.use('/products', productRouter);

export default gateway;
