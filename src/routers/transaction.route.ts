import { Router } from 'express';

import { getBalance, getPendingTransactions, transferFunds } from '@/controllers/transaction.controller';
import { authenticateToken } from '@/middlewares/auth.middleware';
import validateSchema from '@/middlewares/schema-validation.middleware';
import { sendTransactionSchema } from '@/schemas/transaction.schema';
const transactionRouter = Router();

transactionRouter.post('/', authenticateToken, validateSchema(sendTransactionSchema), transferFunds);

transactionRouter.get('/pending', getPendingTransactions);
transactionRouter.get('/wallet', authenticateToken, getBalance);

export { transactionRouter };
