import 'dotenv/config';
import mongoose from 'mongoose';
import { Package } from '../models/Package';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tours-travels';

const updates: Record<string, string> = {
  '6a8b35b609f85c8dfc714dd2':
    'https://res.cloudinary.com/productionappfreelance/image/upload/v1788259736/tours-travels/metkydrblyo8ejozwbt6.jpg',
  '6a8bd66f0175496eb9d52b08':
    'https://res.cloudinary.com/productionappfreelance/image/upload/v1788259737/tours-travels/cjhzcjwszeorfub6sn2n.png',
  '6a8bdd862f8ffba3c0321898':
    'https://res.cloudinary.com/productionappfreelance/image/upload/v1788259738/tours-travels/y87hkawhdpv0hfdxuuba.jpg',
  '6a92e9484429aabaf9ddb563':
    'https://res.cloudinary.com/productionappfreelance/image/upload/v1788259739/tours-travels/avldwlyeivnnbr5kcmji.jpg',
  '6a92e9744429aabaf9ddb566':
    'https://res.cloudinary.com/productionappfreelance/image/upload/v1788259740/tours-travels/rjj3kgigpwpcrscngocl.jpg',
};

async function main(): Promise<void> {
  await mongoose.connect(MONGODB_URI);
  for (const [id, coverImage] of Object.entries(updates)) {
    const result = await Package.updateOne({ _id: id }, { $set: { coverImage } });
    console.log(`${id} -> matched ${result.matchedCount}, modified ${result.modifiedCount}`);
  }
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
