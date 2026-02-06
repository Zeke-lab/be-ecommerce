import { Role } from '@prisma/client';
import { Router } from 'express';
import * as categoryController from '../../controllers/category/category';
import requireRole from '../../middlewares/require-role';
import secureRoute from '../../middlewares/secure-route';

const router = Router();

router.get('/', secureRoute(), categoryController.getCategories);
router.post(
	'/',
	secureRoute(),
	requireRole(Role.ADMIN),
	categoryController.createCategory,
);
router.get('/:id', secureRoute(), categoryController.getCategoryById);
router.patch(
	'/:id',
	secureRoute(),
	requireRole(Role.ADMIN),
	categoryController.updateCategory,
);
router.delete(
	'/:id',
	secureRoute(),
	requireRole(Role.ADMIN),
	categoryController.deleteCategory,
);

export default router;
