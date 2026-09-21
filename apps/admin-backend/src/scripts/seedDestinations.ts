import 'dotenv/config';
import mongoose from 'mongoose';
import { Destination } from '../models/Destination';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tours-travels';

// The fixed list that used to live in schemas/package.schema.ts (DESTINATION_VALUES)
// before destinations became a database-backed, admin-manageable collection.
const initialDestinations = ['Chitwan', 'Pokhara', 'Lumbini', 'Janakpur', 'Kathmandu', 'Ilam', 'Muktinath', 'Nagarkot'];

async function seedDestinations(): Promise<void> {
  await mongoose.connect(MONGODB_URI);
  let created = 0;
  for (const name of initialDestinations) {
    const result = await Destination.updateOne({ name }, { $setOnInsert: { name } }, { upsert: true });
    if (result.upsertedCount > 0) created += 1;
  }
  console.log(`Seeded destinations: ${created} created, ${initialDestinations.length - created} already existed`);
  await mongoose.disconnect();
}

seedDestinations().catch((err) => {
  console.error(err);
  process.exit(1);
});
