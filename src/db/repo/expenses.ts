import type {
  CreateExpenseDTO,
  EditExpenseDTO,
  ExpenseOverview,
  FilterExpensesDTO,
} from '@/models/expenses.js';
import { and, asc, eq } from 'drizzle-orm';
import { db } from '../index.js';
import { expensesTable } from '../schema.js';

export async function findExpenses({
  filters,
  userId,
}: {
  filters: FilterExpensesDTO;
  userId: string;
}): Promise<ExpenseOverview[]> {
  return db.query.expensesTable.findMany({
    orderBy: [asc(expensesTable.occurredAt)],
    limit: filters.limit,
    where: (expenses, { eq, and, gte, lte }) => {
      const conditions = [eq(expenses.userId, userId)];

      if (filters.category) {
        conditions.push(eq(expenses.category, filters.category));
      }

      if (filters.from) {
        conditions.push(gte(expenses.occurredAt, filters.from));
      }

      if (filters.to) {
        conditions.push(lte(expenses.occurredAt, filters.to));
      }

      return and(...conditions);
    },
    columns: {
      id: true,
      amount: true,
      category: true,
      note: true,
      occurredAt: true,
    },
  });
}

export async function findExpenseById({
  id,
  userId,
}: {
  id: string;
  userId?: string;
}) {
  return db.query.expensesTable.findFirst({
    where: (expensesTable, { eq, and }) => {
      return and(
        eq(expensesTable.id, id),
        userId ? eq(expensesTable.userId, userId) : undefined
      );
    },
  });
}

export async function insertExpense({
  data,
  userId,
}: {
  data: CreateExpenseDTO;
  userId: string;
}) {
  return await db
    .insert(expensesTable)
    .values({
      amount: data.amount,
      category: data.category,
      note: data.note,
      occurredAt: data.occurredAt,
      userId,
    })
    .returning({ id: expensesTable.id })
    .execute();
}

export async function updateExpense({
  data,
  userId,
  id,
}: {
  id: string;
  data: EditExpenseDTO;
  userId: string;
}) {
  return await db
    .update(expensesTable)
    .set({
      amount: data.amount,
      category: data.category,
      note: data.note,
      occurredAt: data.occurredAt,
    })
    .where(and(eq(expensesTable.id, id), eq(expensesTable.userId, userId)))
    .execute();
}

export async function deleteExpenseById({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  return await db
    .delete(expensesTable)
    .where(and(eq(expensesTable.id, id), eq(expensesTable.userId, userId)))
    .execute();
}
