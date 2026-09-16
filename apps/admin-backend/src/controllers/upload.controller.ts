import type { Request, Response } from 'express';
import { cloudinary } from '../config/cloudinary';
import { ApiError } from '../utils/ApiError';
import { sendSuccess } from '../utils/apiResponse';

const CLOUDINARY_FOLDER = 'tours-travels';

function uploadBuffer(file: Express.Multer.File): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: CLOUDINARY_FOLDER, resource_type: 'image' },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload failed'));
          return;
        }
        resolve(result.secure_url);
      },
    );
    stream.end(file.buffer);
  });
}

export async function uploadImages(req: Request, res: Response): Promise<void> {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  if (files.length === 0) {
    throw new ApiError(400, 'No images uploaded');
  }
  const urls = await Promise.all(files.map(uploadBuffer));
  sendSuccess(res, { urls }, 201);
}
