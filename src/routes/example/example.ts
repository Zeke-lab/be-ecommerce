import * as exampleController from '../../controllers/example/example';
import { Router } from 'express';
import secureRoute from '../../middlewares/secure-route';

const router = Router();

router.get('/random', secureRoute(), exampleController.getRandomNumber);
router.post('/sum', exampleController.sum);

export default router;
