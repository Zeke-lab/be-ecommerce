import { Role } from '@prisma/client';
import { Router } from 'express';
import * as orderController from '../../controllers/order/order';
import secureRoute from '../../middlewares/secure-route';
import requireRole from '../../middlewares/require-role';

const router = Router();

router.get(
  '/',
  secureRoute(),
  requireRole(Role.USER),
  orderController.getMyOrders,
);

router.get(
  '/:id',
  secureRoute(),
  requireRole(Role.USER),
  orderController.getMyOrderById,
);

router.post(
  '/',
  secureRoute(),
  requireRole(Role.USER),
  orderController.createOrder,
);

router.put(
  '/:id',
  secureRoute(),
  requireRole(Role.USER),
  orderController.updateMyOrder,
);

router.delete(
  '/:id',
  secureRoute(),
  requireRole(Role.USER),
  orderController.deleteMyOrder,
);

export default router;
