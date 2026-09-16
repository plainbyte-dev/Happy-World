import { Router } from 'express';
import { createContactEnquiry } from '../controllers/contact.controller';
import { getPublishedPackageById, listPublishedPackages } from '../controllers/package.controller';
import { validate } from '../middleware/validate';
import { validateObjectId } from '../middleware/validateObjectId';
import { contactInputSchema } from '../schemas/contact.schema';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/packages', asyncHandler(listPublishedPackages));
router.get('/packages/:id', validateObjectId, asyncHandler(getPublishedPackageById));
router.post('/contact', validate(contactInputSchema), asyncHandler(createContactEnquiry));

export default router;
