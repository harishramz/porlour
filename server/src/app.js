import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { config, isAllowedOrigin } from './config.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiRouter } from './routes/api.js';

export const app = express();
export default app;

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) return callback(null, true);
    callback(new Error('Origin is not allowed by CORS.'));
  }
}));
app.use(express.json({ limit: '1mb' }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
app.use('/api/payments', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, message: { error: 'Too many payment requests. Please try again later.' } }));
app.use('/api', apiRouter);
// Vercel service routing may mount this service at /api or strip that prefix.
// Keep both forms working so local and hosted requests share the same API.
app.use('/', apiRouter);
app.use(notFound);
app.use(errorHandler);
