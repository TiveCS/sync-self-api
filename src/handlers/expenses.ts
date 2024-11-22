import {
  deleteExpenseById,
  findExpenseById,
  findExpenses,
  insertExpense,
  updateExpense,
} from '@/db/repo/expenses.js';
import { ExpenseErrors } from '@/errors/expenses.js';
import { authenticated } from '@/middlewares/authenticated.js';
import type { JwtClaimsPayload } from '@/models/auth.js';
import {
  createExpenseSchema,
  editExpenseSchema,
  filtersExpensesSchema,
  type CreateExpenseDTO,
  type EditExpenseDTO,
  type FilterExpensesDTO,
} from '@/models/expenses.js';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

export const expensesHandlers = new Hono();

expensesHandlers.use(authenticated);

expensesHandlers.get(
  '/',
  zValidator('query', filtersExpensesSchema),
  async (c) => {
    const claims: JwtClaimsPayload = c.get('jwtPayload');

    const filters: FilterExpensesDTO = c.req.valid('query');

    const expenses = await findExpenses({ filters, userId: claims.sub });

    return c.json(expenses, 200);
  }
);

expensesHandlers.get('/:id', async (c) => {
  const claims: JwtClaimsPayload = c.get('jwtPayload');
  const id = c.req.param('id');

  const expense = await findExpenseById({ id, userId: claims.sub });

  if (!expense) return c.json({ error: ExpenseErrors.NotFound }, 404);

  if (expense && expense.userId !== claims.sub) {
    return c.json({ error: ExpenseErrors.NotOwned }, 403);
  }

  return c.json(expense, 200);
});

expensesHandlers.post(
  '/',
  zValidator('json', createExpenseSchema),
  async (c) => {
    const claims: JwtClaimsPayload = c.get('jwtPayload');
    const data: CreateExpenseDTO = c.req.valid('json');

    const result = await insertExpense({ data, userId: claims.sub });

    return c.json({ id: result[0].id }, 201);
  }
);

expensesHandlers.put(
  '/:id',
  zValidator('json', editExpenseSchema),
  async (c) => {
    const claims: JwtClaimsPayload = c.get('jwtPayload');
    const id = c.req.param('id');
    const data: EditExpenseDTO = c.req.valid('json');

    const expense = await findExpenseById({ id });

    if (!expense) return c.json({ error: ExpenseErrors.NotFound }, 404);

    if (expense && expense.userId !== claims.sub) {
      return c.json({ error: ExpenseErrors.NotOwned }, 403);
    }

    await updateExpense({
      id,
      data,
      userId: claims.sub,
    });

    return c.body(null, 204);
  }
);

expensesHandlers.delete('/:id', async (c) => {
  const claims: JwtClaimsPayload = c.get('jwtPayload');
  const id = c.req.param('id');

  const expense = await findExpenseById({ id });

  if (!expense) return c.json({ error: ExpenseErrors.NotFound }, 404);

  if (expense && expense.userId !== claims.sub) {
    return c.json({ error: ExpenseErrors.NotOwned }, 403);
  }

  await deleteExpenseById({ id, userId: claims.sub });

  return c.body(null, 204);
});
