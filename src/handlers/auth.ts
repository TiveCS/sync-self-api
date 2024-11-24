import { db } from '@/db/index.js';
import { usersTable } from '@/db/schema.js';
import { AuthErrors } from '@/errors/auth.js';
import { authenticated } from '@/middlewares/authenticated.js';
import {
  signInSchema,
  signUpSchema,
  type JwtClaimsPayload,
} from '@/models/auth.js';
import { generateAccessToken } from '@/usecases/auth/jwt.js';
import { zValidator } from '@hono/zod-validator';
import { hash, verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';

export const authHandlers = new Hono();

authHandlers.post('/signin', zValidator('json', signInSchema), async (c) => {
  const data = c.req.valid('json');

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, data.email));

  if (user.length !== 1)
    return c.json({ error: AuthErrors.InvalidCredentials }, 200);

  const isPasswordMatch = await verify(user[0].password, data.password);

  if (!isPasswordMatch)
    return c.json({ error: AuthErrors.InvalidCredentials }, 200);

  const { token: accessToken, expires } = await generateAccessToken({
    sub: user[0].id,
  });

  return c.json({ accessToken, expires }, 200);
});

authHandlers.post('/signup', zValidator('json', signUpSchema), async (c) => {
  const data = c.req.valid('json');

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, data.email));

  if (user.length > 0)
    return c.json({ error: AuthErrors.CredentialsTaken }, 200);

  const hashedPassword = await hash(data.password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  await db.insert(usersTable).values({
    email: data.email,
    name: data.name,
    password: hashedPassword,
  });

  return c.text('OK', 201);
});

authHandlers.post('/refresh', authenticated, async (c) => {
  const payload: JwtClaimsPayload = c.get('jwtPayload');

  const { token, expires } = await generateAccessToken({
    sub: payload.sub,
  });

  return c.json({ accessToken: token, expires }, 200);
});

authHandlers.get('/me', authenticated, (c) => {
  return c.json(c.get('jwtPayload'));
});
