import { Request, Response } from 'express';

import asyncCatch from '@/errors/asyncCatch.error';
import { getCryptoType } from '@/schemas/crypto.schema';
import { _getChain, _mineBlock } from '@/services/crypto.service';
import { _calculateBalance, _getPendingTransactions, _transferFunds } from '@/services/transaction.service';
import { _regesterUser } from '@/services/user.service';
import { customSuccessResponse } from '@/utils/custom-success-response.util';
import { createPagination } from '@/utils/pagination.util';

export const getChain = asyncCatch(async (req: Request<{}, {}, {}, {}>, res: Response) => {
    const t = req.t;
    const { offset, limit, hash, date } = req.query as unknown as getCryptoType['query'];

    const filter: any = {};

    if (hash) filter.hash = { $regex: hash, $options: 'i' };
    if (date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        filter.createdAt = { $gte: start, $lte: end };
    }

    const result = await _getChain({ filter, offset, limit });
    const paginatedData = createPagination(result.blocks, limit, offset, result.totalCount, 'blocks');

    customSuccessResponse(res, 200, t('block_chain', { ns: 'translation' }), paginatedData);
});

export const mineBlock = asyncCatch(async (req: Request<{}, {}, {}, {}>, res: Response) => {
    const t = req.t;
    const user = req.user;
    const result = await _mineBlock(user.walletAddress);

    customSuccessResponse(res, 200, t('block_mined', { ns: 'translation' }), result);
});
