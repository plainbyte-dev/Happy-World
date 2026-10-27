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

type NominatimResult = { lat: string; lon: string };

// OpenStreetMap's free Nominatim geocoder — no API key, but its usage policy
// requires a descriptive User-Agent identifying the application, and a max of
// ~1 request/second (fine here: this is an admin typing one destination at a
// time, not a bulk/automated caller). Server-side so the browser doesn't need
// to deal with that header or Nominatim's CORS/rate-limit posture directly.
export async function geocodeDestination(req: Request, res: Response): Promise<void> {
  const name = typeof req.query.name === 'string' ? req.query.name.trim() : '';
  if (!name) {
    throw new ApiError(400, 'A destination name is required');
  }

  const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
    q: `${name}, Nepal`,
    format: 'json',
    limit: '1',
  })}`;

  const response = await fetch(url, {
    headers: { 'User-Agent': 'HappyWorldToursAdmin/1.0 (admin destination lookup)' },
  });

  if (!response.ok) {
    throw new ApiError(502, 'Could not reach the coordinate lookup service — enter latitude/longitude manually');
  }

  const results = (await response.json()) as NominatimResult[];
  if (results.length === 0) {
    throw new ApiError(404, `No coordinates found for "${name}" — enter latitude/longitude manually`);
  }

  sendSuccess(res, { lat: Number(results[0].lat), lng: Number(results[0].lon) });
}
