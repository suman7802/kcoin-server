import { Router } from 'express';

import {
    getBalance,
    getPendingBalance,
    getTransactionsByStatus,
    getTransactionsHistory,
    getWalletSummary,
    transferFunds,
} from '@/controllers/transaction.controller';
import { authenticateToken } from '@/middlewares/auth.middleware';
import validateSchema from '@/middlewares/schema-validation.middleware';
import { getTransactionHistorySchema, sendTransactionSchema, TransactionByStatusSchema } from '@/schemas/transaction.schema';
const transactionRouter = Router();

transactionRouter.get('/', validateSchema(TransactionByStatusSchema), getTransactionsByStatus);

transactionRouter.post('/', authenticateToken, validateSchema(sendTransactionSchema), transferFunds);
transactionRouter.get('/wallet', authenticateToken, getBalance);
transactionRouter.get('/pending/balance', authenticateToken, getPendingBalance);
transactionRouter.get('/history', authenticateToken, validateSchema(getTransactionHistorySchema), getTransactionsHistory);
transactionRouter.get('/summary', authenticateToken, getWalletSummary);

export { transactionRouter };
