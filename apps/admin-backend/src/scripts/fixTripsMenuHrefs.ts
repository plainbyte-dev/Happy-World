import 'dotenv/config';
import mongoose from 'mongoose';
import { SiteContent } from '../models/SiteContent';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tours-travels';

// One-off correction: an admin edit drifted the "Trips" mega-menu's trekking/kailash
// hrefs away from their category key (e.g. "/tour-types/kailashyatra" instead of
// "/tour-types/kailash"), which 404s every link to those pages since the dynamic
// route matches on key, not on href text. The schema now forces href = key on every
// future save; this script corrects the data already stored.
async function fixTripsMenuHrefs(): Promise<void> {
  await mongoose.connect(MONGODB_URI);
  const doc = await SiteContent.findOne();
  if (!doc) {
    console.log('No site content document found — nothing to fix.');
    await mongoose.disconnect();
    return;
  }

  let changed = false;
  for (const category of doc.tripsMenu) {
    const correctHref = `/tour-types/${category.key}`;
    if (category.href !== correctHref) {
      console.log(`Fixing "${category.key}": "${category.href}" -> "${correctHref}"`);
      category.href = correctHref;
      changed = true;
    }
  }

  if (changed) {
    await doc.save();
    console.log('Saved.');
  } else {
    console.log('All tripsMenu hrefs already correct — nothing to fix.');
  }

  await mongoose.disconnect();
}

fixTripsMenuHrefs().catch((err) => {
  console.error(err);
  process.exit(1);
});
