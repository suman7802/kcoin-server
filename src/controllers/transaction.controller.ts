import { Request, Response } from 'express';

import asyncCatch from '@/errors/asyncCatch.error';
import { sendTransactionType } from '@/schemas/transaction.schema';
import { _calculateBalance, _getPendingTransactions, _transferFunds } from '@/services/transaction.service';
import { _regesterUser } from '@/services/user.service';
import { customSuccessResponse } from '@/utils/custom-success-response.util';

export const transferFunds = asyncCatch(async (req: Request<{}, {}, sendTransactionType['body'], {}>, res: Response) => {
    const t = req.t;
    const user = req.user;
    const { amount, recipientAddress } = req.body;

    await _transferFunds(user.walletAddress, recipientAddress, amount);

    customSuccessResponse(res, 200, t('funds_transferred', { ns: 'translation' }));
});

export const getPendingTransactions = asyncCatch(async (req: Request<{}, {}, {}, {}>, res: Response) => {
    const t = req.t;

    const pendingTransactions = await _getPendingTransactions();

    customSuccessResponse(res, 200, t('pending_transactions', { ns: 'translation' }), pendingTransactions);
});

export const getBalance = asyncCatch(async (req: Request<{}, {}, {}, {}>, res: Response) => {
    const t = req.t;
    const user = req.user;

    const balance = await _calculateBalance(user.walletAddress);

    customSuccessResponse(res, 200, t('pending_transactions', { ns: 'translation' }), {
        balance: balance,
        walletAddress: user.walletAddress,
    });
});
