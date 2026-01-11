import mongoose from 'mongoose';

import { Transaction, TransactionStatus } from '@/models/transaction.schema';

export const COINBASE_ADDRESS = '00';

/**
 *
 * @param senderAddress
 * @param recipientAddress
 * @param amount
 * @discription This function transfers funds from one wallet to another
 */
export const _transferFunds = async (senderAddress: string, recipientAddress: string, amount: number) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const balance = await _calculateBalance(senderAddress);

        if (amount > balance) {
            throw new Error(`Insufficient balance. Available: ${balance} KCoin, Requested: ${amount} KCoin`);
        }

        const newTx = await Transaction.create(
            [
                {
                    senderAddress,
                    recipientAddress,
                    amount,
                    status: TransactionStatus.PENDING,
                    blockIndex: null,
                    block: null,
                },
            ],
            { session },
        );

        await session.commitTransaction();
        session.endSession();

        return newTx[0];
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
};

/**
 * Get all pending transactions (waiting to be mined)
 */
export const _getPendingTransactions = async () => {
    return Transaction.find({
        status: TransactionStatus.PENDING,
    }).sort({ timestamp: 1 });
};

/**
 * Calculate the current balance for a wallet address
 * Only counts CONFIRMED transactions (those included in blocks)
 */
export const _calculateBalance = async (walletAddress: string): Promise<number> => {
    const transactions = await Transaction.find({
        $or: [{ senderAddress: walletAddress }, { recipientAddress: walletAddress }],
        status: TransactionStatus.CONFIRMED,
    });

    let balance = 0;

    for (const tx of transactions) {
        if (tx.recipientAddress === walletAddress) {
            balance += tx.amount;
        }

        // Don't subtract if this is a coinbase transaction (mining reward)
        if (tx.senderAddress === walletAddress && tx.senderAddress !== COINBASE_ADDRESS) {
            balance -= tx.amount;
        }
    }

    return balance;
};

/**
 * Get all confirmed transactions
 * @param limit
 */
export const _getConfirmedTransactions = async (limit: number) => {
    return Transaction.find({
        status: TransactionStatus.CONFIRMED,
    })
        .sort({ timestamp: -1 })
        .limit(limit)
        .populate('block');
};

/**
 * Get pending balance (funds involved in pending transactions)
 * This represents funds that are locked in unconfirmed outgoing transactions
 */
export const _getPendingBalance = async (walletAddress: string): Promise<number> => {
    const pendingTransactions = await Transaction.find({
        senderAddress: walletAddress,
        status: TransactionStatus.PENDING,
    });

    let pendingAmount = 0;
    for (const tx of pendingTransactions) {
        pendingAmount += tx.amount;
    }

    return pendingAmount;
};

/**
 * Get transaction history for a wallet
 * Can filter by status and supports pagination
 */
export const _getTransactionHistory = async (
    walletAddress: string,
    options: {
        status?: TransactionStatus;
        limit: number;
        offset: number;
    },
) => {
    const { status, limit, offset } = options;

    const query: any = {
        $or: [{ senderAddress: walletAddress }, { recipientAddress: walletAddress }],
    };

    if (status) query.status = status;

    const [transactions, totalCount] = await Promise.all([
        Transaction.find(query).sort({ timestamp: -1 }).skip(offset).limit(limit).populate('block'),
        Transaction.countDocuments(query),
    ]);

    // Add transaction type to each transaction
    const enrichedTransactions = transactions.map((tx) => ({
        ...tx.toObject(),
        type: tx.senderAddress === walletAddress ? (tx.senderAddress === COINBASE_ADDRESS ? 'mining_reward' : 'sent') : 'received',
    }));

    return {
        transactions: enrichedTransactions,
        totalCount,
    };
};

/**
 * Get wallet summary with all balance information
 * This provides a complete overview of the wallet's financial state
 */
export const _getWalletSummary = async (walletAddress: string) => {
    const [availableBalance, pendingBalance, pendingTxCount, totalTransactionCount] = await Promise.all([
        _calculateBalance(walletAddress),
        _getPendingBalance(walletAddress),
        Transaction.countDocuments({
            senderAddress: walletAddress,
            status: TransactionStatus.PENDING,
        }),
        Transaction.countDocuments({
            $or: [{ senderAddress: walletAddress }, { recipientAddress: walletAddress }],
        }),
    ]);

    return {
        walletAddress,
        availableBalance,
        pendingBalance,
        pendingTransactionCount: pendingTxCount,
        totalTransactionCount,
    };
};
