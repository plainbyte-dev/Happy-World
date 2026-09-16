import 'dotenv/config';
import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';
import packageRoutes from './routes/package.routes';
import publicRoutes from './routes/public.routes';
import uploadRoutes from './routes/upload.routes';
import { ApiError } from './utils/ApiError';

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tours-travels';
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGIN || 'http://localhost:3001')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: CLIENT_ORIGINS }));
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Express + TypeScript server is running!' });
});

app.use('/api/admin/packages', packageRoutes);
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
  connectDB(MONGODB_URI).then(() => {
    app.listen(PORT, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    });
  });
}

export default app;
