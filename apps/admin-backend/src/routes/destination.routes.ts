import { Router } from 'express';
import { createDestination, deleteDestination, listDestinations } from '../controllers/destination.controller';
import { requireAdmin } from '../middleware/requireAdmin';
import { validate } from '../middleware/validate';
import { validateObjectId } from '../middleware/validateObjectId';
import { destinationInputSchema } from '../schemas/destination.schema';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(requireAdmin);
router.post('/', validate(destinationInputSchema), asyncHandler(createDestination));
router.get('/', asyncHandler(listDestinations));
router.delete('/:id', validateObjectId, asyncHandler(deleteDestination));

export default router;
