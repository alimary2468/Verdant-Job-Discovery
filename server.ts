import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import jobsRouter from './server/routes/jobs.js';
import recommendRouter from './server/routes/recommend.js';
import applyRouter from './server/routes/apply.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // API Routes FIRST
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'Verdant API', timestamp: new Date().toISOString() });
  });

  app.use('/api/jobs', jobsRouter);
  app.use('/api/recommend', recommendRouter);
  app.use('/api/apply', applyRouter);

  // Vite Middleware for SPA
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌱 Verdant server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
