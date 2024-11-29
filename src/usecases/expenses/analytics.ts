import type {
  Expense,
  ExpenseCategory,
  ExpenseOverview,
} from '@/models/expenses.js';

export function sumExpenses(expenses: ExpenseOverview[]) {
  return expenses.reduce((acc, expense) => acc + expense.amount, 0);
}

export function avgExpenses(expenses: ExpenseOverview[]) {
  return sumExpenses(expenses) / expenses.length;
}
