import { Router } from 'express';
import { syncCart } from '../controllers/cart.controller';
import { validate } from '../middleware/validate';
import { syncCartSchema } from '../schemas';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/sync', optionalAuth, validate(syncCartSchema), syncCart);

export default router;
