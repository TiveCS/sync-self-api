import { z } from 'zod';

export const dateStringSchema = z.coerce.date();
