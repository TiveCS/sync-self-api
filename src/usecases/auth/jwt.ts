import type { JwtClaimsPayload } from '@/models/auth.js';
import { env } from '@/shared/env.js';
import { Jwt } from 'hono/utils/jwt';
import ms from 'ms';

export async function generateAccessToken(payload: JwtClaimsPayload) {
  const exp = Math.floor((Date.now() + ms(env.JWT_EXPIRY)) / 1000);

  payload = {
    ...payload,
    exp,
  };

  const token = await Jwt.sign(payload, env.JWT_SECRET);

  return { token, expires: exp };
}
