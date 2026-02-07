import { Role } from '@prisma/client';
import { Router } from 'express';
import * as productController from '../../controllers/product/product';
import requireRole from '../../middlewares/require-role';
import secureRoute from '../../middlewares/secure-route';

const router = Router();

router.get('/', secureRoute(), productController.getProducts);
router.get('/:id', secureRoute(), productController.getProductById);
router.post(
  '/',
  secureRoute(),
  requireRole(Role.ADMIN),
  productController.createProduct,
);
router.put(
  '/:id',
  secureRoute(),
  requireRole(Role.ADMIN),
  productController.updateProduct,
);
router.delete(
  '/:id',
  secureRoute(),
  requireRole(Role.ADMIN),
  productController.deleteProduct,
);

export default router;
