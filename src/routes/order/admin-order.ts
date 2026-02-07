import { Role } from '@prisma/client';
import { Router } from 'express';
import * as orderController from '../../controllers/order/order';
import secureRoute from '../../middlewares/secure-route';
import requireRole from '../../middlewares/require-role';

const router = Router();

router.get(
  '/',
  secureRoute(),
  requireRole(Role.ADMIN),
  orderController.adminGetOrders,
);

router.get(
  '/:id',
  secureRoute(),
  requireRole(Role.ADMIN),
  orderController.adminGetOrderById,
);

router.patch(
  '/:id',
  secureRoute(),
  requireRole(Role.ADMIN),
  orderController.adminUpdateOrder,
);

router.delete(
  '/:id',
  secureRoute(),
  requireRole(Role.ADMIN),
  orderController.adminDeleteOrder,
);

export default router;
