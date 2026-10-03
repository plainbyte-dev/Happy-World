/// <reference path="./types/express.d.ts" />
import 'dotenv/config';
import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import destinationRoutes from './routes/destination.routes';
import packageRoutes from './routes/package.routes';
import publicRoutes from './routes/public.routes';
import siteContentRoutes from './routes/siteContent.routes';
import uploadRoutes from './routes/upload.routes';
import { ApiError } from './utils/ApiError';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required (set it in .env)');
}

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tours-travels';
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGIN || 'http://localhost:3001')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// TEMPORARY DEBUG LOGGING — remove once the CORS mismatch is confirmed fixed.
// JSON.stringify reveals any stray whitespace/newline characters that a plain
// console.log would silently swallow.
console.log('[cors] raw CLIENT_ORIGIN env var:', JSON.stringify(process.env.CLIENT_ORIGIN));
console.log('[cors] parsed CLIENT_ORIGINS array:', JSON.stringify(CLIENT_ORIGINS));
app.use((req, _res, next) => {
  console.log('[cors] incoming request Origin header:', JSON.stringify(req.headers.origin), 'for', req.method, req.path);
  next();
});

app.use(cors({ origin: CLIENT_ORIGINS }));
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Express + TypeScript server is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin/packages', packageRoutes);
app.use('/api/admin/destinations', destinationRoutes);
app.use('/api/admin/site-content', siteContentRoutes);
app.use('/api/admin', uploadRoutes);
app.use('/api', publicRoutes);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, 'Route not found'));
});

app.use(errorHandler);

if (process.env.VERCEL) {
  // Serverless: the platform invokes the exported app per-request, there is no
  // long-running process to block startup on, so just kick the connection off.
  void connectDB(MONGODB_URI);
} else {
  connectDB(MONGODB_URI)
    .then(() => {
      app.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
      });
    })
    .catch(() => {
      process.exit(1);
    });
}

export default app;
