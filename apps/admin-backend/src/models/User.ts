import { Schema, model, type InferSchemaType } from 'mongoose';

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: '' },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema>;

export const User = model('User', userSchema, 'users');
