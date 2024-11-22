import { type ExpenseCategory } from '@/models/expenses.js';
import { relations, sql } from 'drizzle-orm';
import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { v7 as uuidv7 } from 'uuid';

export const usersTable = pgTable('users', {
  id: varchar({ length: 36 })
    .$defaultFn(() => uuidv7())
    .primaryKey()
    .notNull(),
  email: varchar().unique().notNull(),
  name: varchar().notNull(),
  password: text().notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  deletedAt: timestamp('deleted_at', { mode: 'date', withTimezone: true }),
});

export const expensesTable = pgTable('expenses', {
  id: varchar({ length: 36 })
    .$defaultFn(() => uuidv7())
    .primaryKey()
    .notNull(),
  userId: varchar({ length: 36 })
    .notNull()
    .references(() => usersTable.id),
  amount: integer().notNull(),
  category: integer().$type<ExpenseCategory>().notNull(),
  note: varchar(),
  occurredAt: timestamp('occurred_at', {
    mode: 'date',
    withTimezone: true,
  }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  deletedAt: timestamp('deleted_at', { mode: 'date', withTimezone: true }),
});

export const expensesRelations = relations(expensesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [expensesTable.userId],
    references: [usersTable.id],
  }),
}));

export const usersRelations = relations(usersTable, ({ many }) => ({
  expenses: many(expensesTable),
}));
