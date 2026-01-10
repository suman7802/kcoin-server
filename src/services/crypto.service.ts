import { Block } from '@/models/crypto.model';
import { Transaction } from '@/models/transaction.schema';
import { sha256 } from '@/utils/crypto.util';

const DIFFICULTY_PREFIX = '001';
const MINER_REWARD = 10;

export const _getChain = async ({ filter, offset, limit }: { filter: any; offset: number; limit: number }) => {
    const [blocks, totalCount] = await Promise.all([
        Block.find(filter).sort({ index: 1 }).skip(offset).limit(limit).populate('transactions').lean(),
        Block.countDocuments(filter),
    ]);

    return { blocks, totalCount };
};

export const _mineBlock = async (minerAddress: string) => {
    const pendingTransactions = await Transaction.find({ blockIndex: null });

    // Create coinbase transaction for miner
    const coinbaseTx = await Transaction.create({
        senderAddress: DIFFICULTY_PREFIX,
        recipientAddress: minerAddress,
        amount: MINER_REWARD,
        blockIndex: null,
    });

    const transactions = [...pendingTransactions, coinbaseTx];

    // Determine previous hash
    const lastBlock = await Block.findOne({}).sort({ index: -1 });
    const previousHash = lastBlock ? lastBlock.hash : '0';

    const newIndex = lastBlock ? lastBlock.index + 1 : 0;

    // Proof-of-Work: find nonce
    let nonce = 0;
    let hash = '';
    do {
        const blockContent = JSON.stringify({ index: newIndex, previousHash, transactions: transactions.map((t) => t._id), nonce });
        hash = sha256(blockContent);
        nonce++;
    } while (!hash.startsWith(DIFFICULTY_PREFIX));

    // Create and save the block
    const newBlock = await Block.create({
        index: newIndex,
        previousHash,
        nonce: nonce - 1,
        hash,
        transactions: transactions.map((t) => t._id),
    });

    // Update transactions with block reference
    const updateResult = await Transaction.updateMany(
        { _id: { $in: transactions.map((t) => t._id) } },
        { blockIndex: newBlock.index, block: newBlock._id },
    );

    // Verify all transactions were updated
    if (updateResult.modifiedCount !== transactions.length) {
        throw new Error(`Failed to update all transactions. Expected ${transactions.length}, updated ${updateResult.modifiedCount}`);
    }

    return newBlock.populate('transactions');
};
