import type { Request, Response } from 'express';
import { Package } from '../models/Package';
import { ApiError } from '../utils/ApiError';
import { sendSuccess } from '../utils/apiResponse';

export async function createPackage(req: Request, res: Response): Promise<void> {
  const pkg = await Package.create(req.body);
  sendSuccess(res, pkg, 201);
}

export async function listPackages(_req: Request, res: Response): Promise<void> {
  const packages = await Package.find().sort({ createdAt: -1 });
  sendSuccess(res, packages);
}

export async function listPublishedPackages(_req: Request, res: Response): Promise<void> {
  const packages = await Package.find({ status: 'published' }).sort({ createdAt: -1 });
  sendSuccess(res, packages);
}

export async function getPackageById(req: Request, res: Response): Promise<void> {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) {
    throw new ApiError(404, 'Package not found');
  }
  sendSuccess(res, pkg);
}

export async function getPublishedPackageById(req: Request, res: Response): Promise<void> {
  const pkg = await Package.findOne({ _id: req.params.id, status: 'published' });
  if (!pkg) {
    throw new ApiError(404, 'Package not found');
  }
  sendSuccess(res, pkg);
}

export async function updatePackage(req: Request, res: Response): Promise<void> {
  const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!pkg) {
    throw new ApiError(404, 'Package not found');
  }
  sendSuccess(res, pkg);
}

export async function deletePackage(req: Request, res: Response): Promise<void> {
  const pkg = await Package.findByIdAndDelete(req.params.id);
  if (!pkg) {
    throw new ApiError(404, 'Package not found');
  }
  sendSuccess(res, null);
}
