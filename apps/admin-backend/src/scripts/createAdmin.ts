import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tours-travels';

async function createAdmin(): Promise<void> {
  const email = (process.env.ADMIN_EMAIL || process.argv[2] || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || process.argv[3];
  const name = process.env.ADMIN_NAME || process.argv[4] || '';

  if (!email || !password) {
    console.error('Usage: npm run create-admin -- <email> <password> [name]');
    console.error('   or: ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=... npm run create-admin');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('Password must be at least 8 characters');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`A user with email ${email} already exists — not creating a duplicate.`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ email, passwordHash, name });
  console.log(`Created admin user: ${email}`);
  await mongoose.disconnect();
}

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
