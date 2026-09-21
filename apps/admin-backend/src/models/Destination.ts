import { Schema, model, type InferSchemaType } from 'mongoose';

const destinationSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, minlength: 2, maxlength: 60 },
  },
  { timestamps: true },
);

export type DestinationDocument = InferSchemaType<typeof destinationSchema>;

export const Destination = model('Destination', destinationSchema, 'destinations');
