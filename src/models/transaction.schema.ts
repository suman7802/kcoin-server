import { Document, model, Schema, Types } from 'mongoose';

export interface ITransaction extends Document {
    senderAddress: string;
    recipientAddress: string;
    amount: number;
    timestamp: number;

    blockIndex?: number | null;
    block?: Types.ObjectId | null;
}

const TransactionSchema = new Schema<ITransaction>(
    {
        senderAddress: {
            type: String,
            required: true,
            index: true,
        },

        recipientAddress: {
            type: String,
            required: true,
            index: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        timestamp: {
            type: Number,
            default: Date.now,
        },

        blockIndex: {
            type: Number,
            default: null,
            index: true,
        },

        block: {
            type: Schema.Types.ObjectId,
            ref: 'Block',
            default: null,
        },
    },
    {
        timestamps: false,
        versionKey: false,
    },
);

// Compound index for common query patterns
TransactionSchema.index({ blockIndex: 1, timestamp: 1 });

export const Transaction = model<ITransaction>('Transaction', TransactionSchema);
