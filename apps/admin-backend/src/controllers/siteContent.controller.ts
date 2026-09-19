import type { Request, Response } from 'express';
import { SiteContent } from '../models/SiteContent';
import { SITE_CONTENT_SECTION_KEYS, type SiteContentSection } from '../schemas/siteContent.schema';
import { ApiError } from '../utils/ApiError';
import { sendSuccess } from '../utils/apiResponse';

async function requireSiteContent() {
  const doc = await SiteContent.findOne();
  if (!doc) {
    throw new ApiError(404, 'Site content has not been seeded yet');
  }
  return doc;
}

export async function getSiteContent(_req: Request, res: Response): Promise<void> {
  const doc = await requireSiteContent();
  sendSuccess(res, doc);
}

export async function getPublicSiteContent(_req: Request, res: Response): Promise<void> {
  const doc = await requireSiteContent();
  sendSuccess(res, doc);
}

export async function updateSiteContentSection(req: Request, res: Response): Promise<void> {
  const section = req.params.section as SiteContentSection;
  if (!SITE_CONTENT_SECTION_KEYS.includes(section)) {
    throw new ApiError(400, `Unknown site content section: ${req.params.section}`);
  }

  const doc = await SiteContent.findOneAndUpdate(
    {},
    { $set: { [section]: req.body } },
    { upsert: true, new: true, runValidators: true },
  );

  sendSuccess(res, doc);
}
