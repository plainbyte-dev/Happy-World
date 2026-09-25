import { Router } from 'express';
import { login, me } from '../controllers/auth.controller';
import { requireAdmin } from '../middleware/requireAdmin';
import { validate } from '../middleware/validate';
import { loginInputSchema } from '../schemas/auth.schema';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/login', validate(loginInputSchema), asyncHandler(login));
router.get('/me', requireAdmin, asyncHandler(me));

export default router;
