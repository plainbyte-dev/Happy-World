import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { ApiError } from '../utils/ApiError';

export function validate(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
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
  };
}
