import { Router } from 'express';
import { syncUser, getProfile, updateProfile } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { updateProfileSchema } from '../schemas';
import { requireAuth } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// /api/auth/sync will create or fetch the PostgreSQL user using Firebase Auth token
router.post('/sync', authLimiter, syncUser);

router.get('/profile', requireAuth, getProfile);
router.patch('/profile', requireAuth, validate(updateProfileSchema), updateProfile);

export default router;

