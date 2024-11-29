import { findExpenses } from '@/db/repo/expenses.js';
import { authenticated } from '@/middlewares/authenticated.js';
import type { JwtClaimsPayload } from '@/models/auth.js';
import { analyticsExpensesSchema } from '@/models/expenses.js';
import { avgExpenses, sumExpenses } from '@/usecases/expenses/analytics.js';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

export const analyticsHandlers = new Hono().use(authenticated);

analyticsHandlers.get(
  '/expenses',
  zValidator('query', analyticsExpensesSchema),
  async (c) => {
    const claims: JwtClaimsPayload = c.get('jwtPayload');
    const filters = c.req.valid('query');

    const expenses = await findExpenses({
      filters: { from: filters.firstFrom, to: filters.firstTo },
      userId: claims.sub,
    });
    const compareExpenses = await findExpenses({
      filters: { from: filters.secondFrom, to: filters.secondTo },
      userId: claims.sub,
    });

    const result = {
      first: {
        count: expenses.length,
        total: sumExpenses(expenses),
        average: avgExpenses(expenses),
      },
      second: {
        count: compareExpenses.length,
        total: sumExpenses(compareExpenses),
        average: avgExpenses(compareExpenses),
      },
    };

    return c.json(result, 200);
  }
);
