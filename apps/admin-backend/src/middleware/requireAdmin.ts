import type { NextFunction, Request, Response } from 'express';

// TODO: replace with real JWT-based admin authentication once auth is built.
export function requireAdmin(_req: Request, _res: Response, next: NextFunction): void {
  next();
}
