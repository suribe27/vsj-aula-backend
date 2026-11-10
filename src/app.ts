import cors from 'cors';
import express from 'express';
import { container } from './container';
import { env } from './infrastructure/config/env';
import { errorHandler, notFoundHandler } from './interface/middlewares/errorHandler';
import { authRouter } from './interface/routers/authRouter';
import { categoryRouter } from './interface/routers/categoryRouter';
import { serviceRouter } from './interface/routers/serviceRouter';

export const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

const { authenticate } = container;
app.use('/api/auth', authRouter(container.authController, authenticate));
app.use('/api/categories', categoryRouter(container.categoryController, authenticate));
app.use('/api/services', serviceRouter(container.serviceController, authenticate));

app.use(notFoundHandler);
app.use(errorHandler);
