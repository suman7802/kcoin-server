import { z } from 'zod';

export const sendTransactionSchema = z.object({
    body: z.object({
        recipientAddress: z.string().uuid('Recipient wallet address must be a valid UUID'),
        amount: z.number().positive('Amount must be greater than 0'),
    }),
});

export const confirmTransactionSchema = z.object({
    query: z.object({
        limit: z.coerce.number().int().positive().max(100).default(10),
    }),
});

export const getTransactionHistorySchema = z.object({
    query: z.object({
        status: z.enum(['pending', 'confirmed']).default('confirmed'),
        offset: z.coerce.number().int().nonnegative().default(0),
        limit: z.coerce.number().int().positive().max(100).default(10),
    }),
});

export type sendTransactionType = z.infer<typeof sendTransactionSchema>;
export type confirmTransactionType = z.infer<typeof confirmTransactionSchema>;
export type getTransactionHistoryType = z.infer<typeof getTransactionHistorySchema>;
