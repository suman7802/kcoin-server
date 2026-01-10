import mongoose from 'mongoose';

import { Transaction } from '@/models/transaction.schema';

export const _transferFunds = async (senderAddress: string, recipientAddress: string, amount: number) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Lock the sender's balance calculation
        const transactions = await Transaction.find({
            $or: [{ senderAddress }, { recipientAddress }],
            blockIndex: { $ne: null },
        }).session(session);

        let senderBalance = 0;
        for (const tx of transactions) {
            if (tx.recipientAddress === senderAddress) senderBalance += tx.amount;
            if (tx.senderAddress === senderAddress) senderBalance -= tx.amount;
        }

        if (amount > senderBalance) {
            throw new Error('Insufficient balance');
        }

        // Create the transaction (pending initially)
        const newTx = await Transaction.create(
            [
                {
                    senderAddress,
                    recipientAddress,
                    amount,
                    timestamp: Date.now(),
                    blockIndex: null,
                },
            ],
            { session },
        );

        await session.commitTransaction();
        session.endSession();

        return newTx[0];
    } catch (err) {
        // Rollback any changes if anything fails
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
};

export const _getPendingTransactions = async () => {
    return Transaction.find({ blockIndex: null }).sort({ timestamp: 1 });
};

export const _calculateBalance = async (walletAddress: string) => {
    const transactions = await Transaction.find({
        $or: [{ senderAddress: walletAddress }, { recipientAddress: walletAddress }],
        blockIndex: { $ne: null },
    });

    let balance = 0;
    for (const tx of transactions) {
        if (tx.recipientAddress === walletAddress) balance += tx.amount;
        if (tx.senderAddress === walletAddress) balance -= tx.amount;
    }

    return balance;
};
