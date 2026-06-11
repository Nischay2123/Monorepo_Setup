import express from 'express';
import cors from 'cors';
import { errorHandler } from './shared/middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Centralized error handling
app.use(errorHandler);

export { app };
