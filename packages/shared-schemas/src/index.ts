import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
});

export const jobSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  location: z.string(),
});
