import type { PackageInput } from '../schemas/package.schema';

export interface PackageRecord extends PackageInput {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export type PackageListItem = Pick<
  PackageRecord,
  '_id' | 'title' | 'coverImage' | 'destinations' | 'duration' | 'itinerary' | 'cost' | 'status' | 'createdAt'
>;

export interface DestinationRecord {
  _id: string;
  name: string;
  // Optional because destinations created before these fields existed won't have
  // them set — the backend doesn't backfill old documents.
  lat?: number;
  lng?: number;
  createdAt: string;
  updatedAt: string;
}
