import { Block } from '@/models/block.model';
import { Transaction, TransactionStatus } from '@/models/transaction.schema';
import { sha256 } from '@/utils/crypto.util';

import { COINBASE_ADDRESS } from './transaction.service';

const DIFFICULTY_PREFIX = '00';
const MINER_REWARD = 10;

export const _getChain = async ({ filter, offset, limit }: { filter: any; offset: number; limit: number }) => {
    const [blocks, totalCount] = await Promise.all([
        Block.find(filter).sort({ index: 1 }).skip(offset).limit(limit).populate('transactions').lean(),
        Block.countDocuments(filter),
    ]);

    return { blocks, totalCount };
};

export const _mineBlock = async (minerAddress: string) => {
    const pendingTransactions = await Transaction.find({ status: TransactionStatus.PENDING });

    const coinbaseTransactions = await Transaction.create({
        senderAddress: COINBASE_ADDRESS,
        recipientAddress: minerAddress,
        amount: MINER_REWARD,
        status: TransactionStatus.CONFIRMED,

        blockIndex: null,
        block: null,
    });

    const transactions = [...pendingTransactions, coinbaseTransactions];

    const lastBlock = (await Block.findOne().sort({ index: -1 })) || { hash: '0', index: -1, previousHash: '0' };

    let nonce = 0;
    let hash = '';

    do {
        const blockContent = JSON.stringify({
            index: lastBlock.index + 1,
            hash: lastBlock.hash,
            transactions: transactions.map((t) => t._id),
            nonce,
        });

        hash = sha256(blockContent);
        nonce++;
    } while (!hash.startsWith(DIFFICULTY_PREFIX));

    const newBlock = await Block.create({
        index: lastBlock.index + 1,
        previousHash: lastBlock.hash,
        nonce,
        hash,
        transactions: transactions.map((t) => t._id),
    });

    await Transaction.updateMany(
        { _id: { $in: transactions.map((t) => t._id) } },
        {
            blockIndex: newBlock.index,
            block: newBlock._id,
            status: TransactionStatus.CONFIRMED,
        },
    );

    return newBlock.populate('transactions');
};
