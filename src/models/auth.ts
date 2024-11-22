import type { JWTPayload } from 'hono/utils/jwt/types';
import { z } from 'zod';

export type JwtClaimsPayload = JWTPayload & { sub: string };

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const signUpSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255),
  password: z.string().min(1).max(255),
});

export type SignInDTO = z.infer<typeof signInSchema>;
export type SignUpDTO = z.infer<typeof signUpSchema>;
