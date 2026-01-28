import { Router } from 'express';
import * as productController from '../../controllers/product/product';
import secureRoute from '../../middlewares/secure-route';

const router = Router();

router.get('/', secureRoute(), productController.getProducts);
router.post('/', secureRoute(), productController.createProduct);
router.get('/:id', secureRoute(), productController.getProductById);
router.patch('/:id', secureRoute(), productController.updateProduct);
router.delete('/:id', secureRoute(), productController.deleteProduct);

export default router;

