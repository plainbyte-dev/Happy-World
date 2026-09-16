import { Schema, model, type InferSchemaType } from 'mongoose';

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    interest: { type: String, required: true },
    message: { type: String, required: true },
    updates: { type: Boolean, default: false },
    source: { type: String, default: 'website' },
  },
  { timestamps: true },
);

export type ContactDocument = InferSchemaType<typeof contactSchema>;

export const Contact = model('Contact', contactSchema, 'contacts');
