import { Router } from 'express';
import {
  createPackage,
  deletePackage,
  getPackageById,
  listPackages,
  updatePackage,
} from '../controllers/package.controller';
import { requireAdmin } from '../middleware/requireAdmin';
import { validate } from '../middleware/validate';
import { validateObjectId } from '../middleware/validateObjectId';
import { packageInputSchema } from '../schemas/package.schema';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', requireAdmin, validate(packageInputSchema), asyncHandler(createPackage));
router.get('/', requireAdmin, asyncHandler(listPackages));
router.get('/:id', requireAdmin, validateObjectId, asyncHandler(getPackageById));
router.patch('/:id', requireAdmin, validateObjectId, validate(packageInputSchema), asyncHandler(updatePackage));
router.delete('/:id', requireAdmin, validateObjectId, asyncHandler(deletePackage));

export default router;
