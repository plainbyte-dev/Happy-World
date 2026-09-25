import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { sendSuccess } from '../utils/apiResponse';
import { signAuthToken } from '../utils/jwt';

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signAuthToken({ sub: user._id.toString(), email: user.email });
  sendSuccess(res, { token, user: { email: user.email, name: user.name } });
}

export async function me(req: Request, res: Response): Promise<void> {
  const user = await User.findById(req.user?.sub).select('email name');
  if (!user) {
    throw new ApiError(401, 'Invalid or expired session');
  }
  sendSuccess(res, { email: user.email, name: user.name });
}
