import { db } from '../index.js';
import { usersTable } from '../schema.js';

export async function findUserByEmail(email: string) {
  return db.query.usersTable.findFirst({
    where: (usersTable, { eq }) => eq(usersTable.email, email),
  });
}

export async function findUserById(id: string) {
  return db.query.usersTable.findFirst({
    where: (usersTable, { eq }) => eq(usersTable.id, id),
  });
}

export async function insertUser(newUser: {
  email: string;
  name: string;
  password: string;
}) {
  return await db.insert(usersTable).values(newUser);
}
