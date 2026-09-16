import 'dotenv/config';
import mongoose from 'mongoose';
import { Package } from '../models/Package';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tours-travels';

async function main(): Promise<void> {
  await mongoose.connect(MONGODB_URI);
  const packages = await Package.find({}, { title: 1, coverImage: 1, itinerary: 1, status: 1 }).lean();
  for (const pkg of packages) {
    console.log(`\n${pkg._id} | ${pkg.status} | ${pkg.title}`);
    console.log(`  coverImage: ${pkg.coverImage}`);
    (pkg.itinerary ?? []).forEach((day: any) => {
      console.log(`  day ${day.day} images: ${JSON.stringify(day.images)}`);
    });
  }
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
