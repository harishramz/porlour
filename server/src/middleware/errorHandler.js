import { ZodError } from 'zod';

export const notFound = (req, res) => {
  res.status(404).json({ error: 'Route not found.' });
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  if (error instanceof ZodError) {
    return res.status(400).json({ error: 'Request validation failed.' });
  }

  console.error(error);
  const status = Number(error.status) || 500;
  res.status(status).json({
    error: status >= 500 ? 'An unexpected server error occurred.' : error.message
  });
};
