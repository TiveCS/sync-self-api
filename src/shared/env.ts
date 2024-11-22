import 'dotenv/config';
import { cleanEnv, port, str, url } from 'envalid';

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'production', 'test'],
    default: 'development',
  }),
  DATABASE_URL: url(),
  PORT: port({ default: 8080 }),
  JWT_SECRET: str(),
  JWT_EXPIRY: str({ default: '1d' }),
});

export type Env = typeof env;
