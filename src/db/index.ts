import { env } from '@/shared/env.js';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema.js'

export const db = drizzle(env.DATABASE_URL, { schema: schema });
