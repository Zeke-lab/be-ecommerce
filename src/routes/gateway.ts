import { Router } from 'express';
import authRouter from './auth/auth';
import exampleRouter from './example/example';
import categoryRouter from './category/category';
import productRouter from './product/product';
import orderRouter from './order/order';
import adminOrderRouter from './order/admin-order';

const gateway = Router();

gateway.use('/auth', authRouter);
gateway.use('/example', exampleRouter);
gateway.use('/categories', categoryRouter);
gateway.use('/products', productRouter);
gateway.use('/orders', orderRouter);
gateway.use('/admin/orders', adminOrderRouter);

export default gateway;
