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
