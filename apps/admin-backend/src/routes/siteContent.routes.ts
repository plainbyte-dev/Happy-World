import { Router, type NextFunction, type Request, type Response } from 'express';
import { getSiteContent, updateSiteContentSection } from '../controllers/siteContent.controller';
import { requireAdmin } from '../middleware/requireAdmin';
import { SITE_CONTENT_SECTIONS, type SiteContentSection } from '../schemas/siteContent.schema';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

function validateSiteContentSection(req: Request, _res: Response, next: NextFunction): void {
  const schema = SITE_CONTENT_SECTIONS[req.params.section as SiteContentSection];
  if (!schema) {
    next(new ApiError(400, `Unknown site content section: ${req.params.section}`));
    return;
  }

  const result = schema.safeParse(req.body);
  if (!result.success) {
    const fields: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join('.');
      if (!fields[path]) {
        fields[path] = issue.message;
      }
    }
    next(new ApiError(400, 'Validation failed', fields));
    return;
  }

  req.body = result.data;
  next();
}

const router = Router();

router.use(requireAdmin);
router.get('/', asyncHandler(getSiteContent));
router.patch('/:section', validateSiteContentSection, asyncHandler(updateSiteContentSection));

export default router;
