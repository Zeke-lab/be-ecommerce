import * as userController from '../../controllers/auth/user';
import { Router } from 'express';
import secureRoute from '../../middlewares/secure-route';

const router = Router();

router.get('/', secureRoute(), userController.auth);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

export default router;
