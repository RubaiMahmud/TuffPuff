import { Router } from 'express';
import { getProducts, getProductById, getSimilarProducts, getBrands, getCategories, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { validate, validateQuery } from '../middleware/validate';
import { createProductSchema, updateProductSchema, productQuerySchema } from '../schemas';

const router = Router();

// Public routes
router.get('/', validateQuery(productQuerySchema), getProducts);
router.get('/brands', getBrands);
router.get('/categories', getCategories);
router.get('/:id', getProductById);
router.get('/:id/similar', getSimilarProducts);

// Admin routes
router.post('/', requireAuth, requireAdmin, validate(createProductSchema), createProduct);
router.patch('/:id', requireAuth, requireAdmin, validate(updateProductSchema), updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

export default router;
