import type { expensesTable } from '@/db/schema.js';
import { dateStringSchema, numStringSchema } from '@/shared/schema.js';
import type { InferSelectModel } from 'drizzle-orm';
import { z } from 'zod';

export type Expense = InferSelectModel<typeof expensesTable>;

export type ExpenseOverview = {
  id: string;
  amount: number;
  category: ExpenseCategory;
  note: string | null;
  occurredAt: Date;
};

export enum ExpenseCategory {
  Education = 1,
  Entertainment = 2,
  Food = 3,
  Healthcare = 4,
  Rent = 5,
  Transportation = 6,
  Groceries = 7,
  Utilities = 8,
  Donation = 9,
  Other = 10,
}

export const createExpenseSchema = z.object({
  amount: z.number().int().positive(),
  category: z.nativeEnum(ExpenseCategory),
  note: z.string().max(255).optional(),
  occurredAt: dateStringSchema,
});

export const editExpenseSchema = z.object({
  amount: z.number().int().positive(),
  category: z.nativeEnum(ExpenseCategory),
  note: z.string().min(1).max(255),
  occurredAt: dateStringSchema,
});

export const filtersExpensesSchema = z.object({
  category: z.nativeEnum(ExpenseCategory).optional(),
  from: dateStringSchema.optional(),
  to: dateStringSchema.optional(),
  limit: numStringSchema.int().positive().optional(),
  cursor: z.string().optional(),
});

export const analyticsExpensesSchema = z.object({
  firstFrom: dateStringSchema,
  firstTo: dateStringSchema,
  secondFrom: dateStringSchema,
  secondTo: dateStringSchema,
});

export type CreateExpenseDTO = z.infer<typeof createExpenseSchema>;
export type EditExpenseDTO = z.infer<typeof editExpenseSchema>;
export type FilterExpensesDTO = z.infer<typeof filtersExpensesSchema>;
export type AnalyticsExpenseDTO = z.infer<typeof analyticsExpensesSchema>;
