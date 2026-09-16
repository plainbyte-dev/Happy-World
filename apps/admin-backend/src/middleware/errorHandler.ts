import type { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';
import { ApiError } from '../utils/ApiError';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ success: false, error: { message: err.message, fields: err.fields } });
    return;
  }

  if (err instanceof MulterError) {
    res.status(400).json({ success: false, error: { message: err.message } });
    return;
  }

  console.error(err);
  res.status(500).json({ success: false, error: { message: 'Internal server error' } });
}
