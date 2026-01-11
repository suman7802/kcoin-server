import { Document, model, Schema, Types } from 'mongoose';

export interface IBlock extends Document {
    index: number;
    timestamp: number;
    previousHash: string;
    nonce: number;
    hash: string;
    transactions: Types.ObjectId[];
    createdAt: Date;
}

const BlockSchema = new Schema<IBlock>(
    {
        index: {
            type: Number,
            required: true,
            unique: true,
            index: true,
        },
        timestamp: {
            type: Number,
            required: true,
            default: Date.now,
        },
        previousHash: {
            type: String,
            required: true,
        },
        nonce: {
            type: Number,
            required: true,
        },
        hash: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        transactions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Transaction',
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: false,
        versionKey: false,
    },
);

export const Block = model<IBlock>('Block', BlockSchema);
