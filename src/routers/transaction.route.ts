import { Router } from 'express';

import {
    getBalance,
    getConfirmedTransactionsBalance,
    getPendingBalance,
    getPendingTransactions,
    getTransactionsHistory,
    getWalletSummary,
    transferFunds,
} from '@/controllers/transaction.controller';
import { authenticateToken } from '@/middlewares/auth.middleware';
import validateSchema from '@/middlewares/schema-validation.middleware';
import { confirmTransactionSchema, getTransactionHistorySchema, sendTransactionSchema } from '@/schemas/transaction.schema';
const transactionRouter = Router();

transactionRouter.get('/pending', getPendingTransactions);
transactionRouter.get('/confirmed', validateSchema(confirmTransactionSchema), getConfirmedTransactionsBalance);

transactionRouter.post('/', authenticateToken, validateSchema(sendTransactionSchema), transferFunds);
transactionRouter.get('/wallet', authenticateToken, getBalance);
transactionRouter.get('/pending/balance', authenticateToken, getPendingBalance);
transactionRouter.get('/history', authenticateToken, validateSchema(getTransactionHistorySchema), getTransactionsHistory);
transactionRouter.get('/summary', authenticateToken, getWalletSummary);

export { transactionRouter };
