import { z } from 'zod';

export const authSchema = z.object({
    body: z.object({
        username: z.string().trim().min(3, 'Username must be at least 3 characters').max(30, 'Username must be at most 30 characters'),
        password: z.string().trim().min(8, 'Password must be at least 8 characters').max(128, 'Password must be at most 128 characters'),
    }),
});

export type authType = z.infer<typeof authSchema>;
