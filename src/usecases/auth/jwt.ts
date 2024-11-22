import type { JwtClaimsPayload } from '@/models/auth.js';
import { env } from '@/shared/env.js';
import { Jwt } from 'hono/utils/jwt';
import ms from 'ms';

export async function generateAccessToken(
  payload: JwtClaimsPayload
): Promise<string> {
  const exp = Date.now() + ms(env.JWT_EXPIRY);

  payload = {
    ...payload,
    exp: Math.floor(exp / 1000),
  };

  return Jwt.sign(payload, env.JWT_SECRET);
}
