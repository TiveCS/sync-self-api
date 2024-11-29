import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { authHandlers } from './handlers/auth.js';
import { expensesHandlers } from './handlers/expenses.js';
import { env } from './shared/env.js';
import { analyticsHandlers } from './handlers/analytics.js';

const app = new Hono().basePath('/api');
const v1 = new Hono();

app.use(logger());

app.route('/auth', authHandlers);

v1.route('/expenses', expensesHandlers);
v1.route('/analytics', analyticsHandlers);

app.route('/v1', v1);

const port = env.PORT;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
