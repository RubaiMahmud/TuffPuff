import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { validate, validateQuery } from '../middleware/validate';
import { updateOrderStatusSchema, createProductSchema, updateProductSchema, orderQuerySchema } from '../schemas';
import { getAllProducts, getAllOrders, updateOrderStatus, getAllUsers, getUserOrders, getDashboardStats } from '../controllers/admin.controller';
import { createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';

const router = Router();

router.use(requireAuth, requireAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Product management
router.get('/products', getAllProducts);
router.post('/products', validate(createProductSchema), createProduct);
router.patch('/products/:id', validate(updateProductSchema), updateProduct);
router.delete('/products/:id', deleteProduct);

// Order management
router.get('/orders', validateQuery(orderQuerySchema), getAllOrders);
router.patch('/orders/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);

// User management
router.get('/users', getAllUsers);
router.get('/users/:userId/orders', getUserOrders);

export default router;
