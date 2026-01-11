import { Document, model, Schema, Types } from 'mongoose';

export enum TransactionStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
}

export interface ITransaction extends Document {
    senderAddress: string;
    recipientAddress: string;
    amount: number;
    status: TransactionStatus;
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
            min: 0.0001,
        },

        status: {
            type: String,
            enum: Object.values(TransactionStatus),
            default: TransactionStatus.PENDING,
            index: true,
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

TransactionSchema.index({ status: 1, timestamp: 1 });
TransactionSchema.index({ blockIndex: 1, status: 1 });
TransactionSchema.index({ senderAddress: 1, status: 1 });
TransactionSchema.index({ recipientAddress: 1, status: 1 });

export const Transaction = model<ITransaction>('Transaction', TransactionSchema);
