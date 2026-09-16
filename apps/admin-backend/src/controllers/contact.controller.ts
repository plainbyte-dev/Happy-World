import type { Request, Response } from 'express';
import { Contact } from '../models/Contact';
import { sendSuccess } from '../utils/apiResponse';

export async function createContactEnquiry(req: Request, res: Response): Promise<void> {
  const enquiry = await Contact.create(req.body);
  sendSuccess(res, enquiry, 201);
}
