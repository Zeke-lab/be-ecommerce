import { Router } from 'express';
import * as categoryController from '../../controllers/category/category';
import secureRoute from '../../middlewares/secure-route';

const router = Router();

router.get('/', secureRoute(), categoryController.getCategories);
router.post('/', secureRoute(), categoryController.createCategory);
router.get('/:id', secureRoute(), categoryController.getCategoryById);
router.patch('/:id', secureRoute(), categoryController.updateCategory);
router.delete('/:id', secureRoute(), categoryController.deleteCategory);

export default router;
