import { Role } from '@prisma/client';
import { Router } from 'express';
import * as productController from '../../controllers/product/product';
import requireRole from '../../middlewares/require-role';
import secureRoute from '../../middlewares/secure-route';

const router = Router();

router.post(
  '/',
  secureRoute(),
  requireRole(Role.ADMIN),
  productController.createProduct,
);

export default router;
