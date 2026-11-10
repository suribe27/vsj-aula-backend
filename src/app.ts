import cors from 'cors';
import express from 'express';
import { env } from './infrastructure/config/env';
import { errorHandler, notFoundHandler } from './interface/middlewares/errorHandler';

export const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(notFoundHandler);
app.use(errorHandler);
