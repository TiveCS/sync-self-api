import { env } from '@/shared/env.js';
import { createMiddleware } from 'hono/factory';
import { jwt } from 'hono/jwt';

export const authenticated = createMiddleware(async (c, next) => {
  const jwtMiddleware = jwt({
    secret: env.JWT_SECRET,
  });

  return jwtMiddleware(c, next);
});
