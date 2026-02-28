import { Router } from 'express';
import { getAddresses, createAddress, updateAddress, deleteAddress } from '../controllers/address.controller';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createAddressSchema, updateAddressSchema } from '../schemas';

const router = Router();

router.use(requireAuth);

router.get('/', getAddresses);
router.post('/', validate(createAddressSchema), createAddress);
router.patch('/:id', validate(updateAddressSchema), updateAddress);
router.delete('/:id', deleteAddress);

export default router;
