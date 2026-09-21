import type { Request, Response } from 'express';
import { Destination } from '../models/Destination';
import { ApiError } from '../utils/ApiError';
import { sendSuccess } from '../utils/apiResponse';

export async function createDestination(req: Request, res: Response): Promise<void> {
  const existing = await Destination.findOne({ name: req.body.name });
  if (existing) {
    throw new ApiError(409, 'A destination with this name already exists', { name: 'This destination already exists' });
  }
  const destination = await Destination.create(req.body);
  sendSuccess(res, destination, 201);
}

export async function listDestinations(_req: Request, res: Response): Promise<void> {
  const destinations = await Destination.find().sort({ name: 1 });
  sendSuccess(res, destinations);
}

export async function deleteDestination(req: Request, res: Response): Promise<void> {
  const destination = await Destination.findByIdAndDelete(req.params.id);
  if (!destination) {
    throw new ApiError(404, 'Destination not found');
  }
  sendSuccess(res, null);
}
