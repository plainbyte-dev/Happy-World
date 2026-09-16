import 'dotenv/config';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { cloudinary } from '../config/cloudinary';

const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');
const CLOUDINARY_FOLDER = 'tours-travels';

async function uploadFile(filePath: string): Promise<string> {
  const buffer = await readFile(filePath);
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
    stream.end(buffer);
  });
}

async function main(): Promise<void> {
  const entries = await readdir(UPLOADS_DIR);
  const imageFiles = entries.filter((name) => /\.(jpe?g|png|webp)$/i.test(name));

  if (imageFiles.length === 0) {
    console.log('No image files found in uploads directory.');
    return;
  }

  for (const fileName of imageFiles) {
    const url = await uploadFile(path.join(UPLOADS_DIR, fileName));
    console.log(`${fileName} -> ${url}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
