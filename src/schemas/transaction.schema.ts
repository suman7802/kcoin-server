import { z } from 'zod';

export const sendTransactionSchema = z.object({
    body: z.object({
        recipientAddress: z.string().uuid('Recipient wallet address must be a valid UUID'),
        amount: z.number().positive('Amount must be greater than 0'),
    }),
});

export type sendTransactionType = z.infer<typeof sendTransactionSchema>;
