import { z } from 'zod';

export const getCryptoSchema = z.object({
    query: z.object({
        hash: z.string().trim().optional(),
        date: z
            .string()
            .trim()
            .transform((val) => (val ? new Date(val) : undefined))
            .optional(),
        offset: z.coerce.number().int().nonnegative().default(0),
        limit: z.coerce.number().int().positive().max(100).default(10),
    }),
});

export type getCryptoType = z.infer<typeof getCryptoSchema>;
