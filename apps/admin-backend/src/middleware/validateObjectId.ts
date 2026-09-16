import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError';

export function validateObjectId(req: Request, _res: Response, next: NextFunction): void {
  if (!mongoose.isValidObjectId(req.params.id)) {
    next(new ApiError(400, 'Invalid package id'));
    return;
  }
  next();
}
