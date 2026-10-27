import { Schema, model, type InferSchemaType } from 'mongoose';

const destinationSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, minlength: 2, maxlength: 60 },
    // Added for the public site's destinations map — existing destinations created
    // before this field existed won't have it set (Mongoose doesn't retroactively
    // enforce `required` on documents saved before the rule was added), so readers
    // of this data must treat lat/lng as possibly absent, not assume it's always set.
    lat: { type: Number, required: true, min: -90, max: 90 },
    lng: { type: Number, required: true, min: -180, max: 180 },
  },
  { timestamps: true },
);

export type DestinationDocument = InferSchemaType<typeof destinationSchema>;

export const Destination = model('Destination', destinationSchema, 'destinations');
