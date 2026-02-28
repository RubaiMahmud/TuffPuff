import { Router } from 'express';
import { createOrder, getUserOrders, getOrderById } from '../controllers/order.controller';
import { requireAuth } from '../middleware/auth';
import { validate, validateQuery } from '../middleware/validate';
import { createOrderSchema, orderQuerySchema } from '../schemas';

const router = Router();

router.use(requireAuth);

router.post('/', validate(createOrderSchema), createOrder);
router.get('/', validateQuery(orderQuerySchema), getUserOrders);
router.get('/:id', getOrderById);

export default router;
