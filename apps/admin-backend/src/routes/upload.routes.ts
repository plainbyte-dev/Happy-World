import { Router } from 'express';
import { uploadImages } from '../controllers/upload.controller';
import { requireAdmin } from '../middleware/requireAdmin';
import { upload } from '../middleware/upload';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/upload', requireAdmin, upload.array('images', 10), asyncHandler(uploadImages));

export default router;
