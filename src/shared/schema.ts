import { z } from 'zod';

export const dateStringSchema = z.coerce.date();

export const numStringSchema = z.coerce.number();
