import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { verifyAuthToken } from '../utils/jwt';

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined;

  if (!token) {
    next(new ApiError(401, 'Authentication required'));
    return;
  }

  try {
    req.user = verifyAuthToken(token);
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired session'));
  }
}
