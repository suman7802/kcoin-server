import { Request, Response } from 'express';

import asyncCatch from '@/errors/asyncCatch.error';
import { TransactionStatus } from '@/models/transaction.schema';
import { getTransactionHistoryType, sendTransactionType, TransactionByStatusType } from '@/schemas/transaction.schema';
import {
    _calculateBalance,
    _getPendingBalance,
    _getTransactionHistory,
    _getTransactionsByStatus,
    _getWalletSummary,
    _transferFunds,
} from '@/services/transaction.service';
import { _regesterUser } from '@/services/user.service';
import { customSuccessResponse } from '@/utils/customSuccessResponse.util';
import { createPagination } from '@/utils/pagination.util';

export const transferFunds = asyncCatch(async (req: Request<{}, {}, sendTransactionType['body'], {}>, res: Response) => {
    const t = req.t;
    const user = req.user;
    const { amount, recipientAddress } = req.body;

    await _transferFunds(user.walletAddress, recipientAddress, amount);

    customSuccessResponse(res, 200, t('funds_transferred', { ns: 'translation' }));
});

export const getTransactionsByStatus = asyncCatch(async (req: Request<{}, {}, {}, {}>, res: Response) => {
    const t = req.t;
    const { limit, status } = req.query as unknown as TransactionByStatusType['query'];

    const pendingTransactions = await _getTransactionsByStatus(status as TransactionStatus, limit);

    customSuccessResponse(res, 200, t('pending_transactions', { ns: 'translation' }), pendingTransactions);
});

export const getBalance = asyncCatch(async (req: Request<{}, {}, {}, {}>, res: Response) => {
    const t = req.t;
    const user = req.user;

    const balance = await _calculateBalance(user.walletAddress);
    const pendingBalance = await _getPendingBalance(user.walletAddress);

    customSuccessResponse(res, 200, t('pending_transactions', { ns: 'translation' }), {
        balance: balance - pendingBalance,
        walletAddress: user.walletAddress,
    });
});

export const getPendingBalance = asyncCatch(async (req: Request<{}, {}, {}, {}>, res: Response) => {
    const t = req.t;
    const user = req.user;

    const balance = await _getPendingBalance(user.walletAddress);

    customSuccessResponse(res, 200, t('pending_balance', { ns: 'translation' }), {
        balance: balance,
        walletAddress: user.walletAddress,
    });
});

export const getTransactionsHistory = asyncCatch(async (req: Request<{}, {}, {}, {}>, res: Response) => {
    const t = req.t;
    const user = req.user;
    const query = req.query as unknown as getTransactionHistoryType['query'];

    const { transactions, totalCount } = await _getTransactionHistory(user.walletAddress, {
        status: query.status as TransactionStatus,
        limit: query.limit,
        offset: query.offset,
    });

    const paginatedData = createPagination(transactions, query.limit, query.offset, totalCount, 'transactions');

    customSuccessResponse(res, 200, t('confirmed_transactions', { ns: 'translation' }), paginatedData);
});

export const getWalletSummary = asyncCatch(async (req: Request<{}, {}, {}, {}>, res: Response) => {
    const t = req.t;
    const user = req.user;

    const summary = await _getWalletSummary(user.walletAddress);

    customSuccessResponse(res, 200, t('wallet_summary', { ns: 'translation' }), summary);
});
