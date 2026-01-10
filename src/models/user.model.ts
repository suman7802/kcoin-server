import { Document, model, Schema } from 'mongoose';
import { v4 } from 'uuid';

export interface IUser extends Document {
    username: string;
    hashPassword: string;
    walletAddress: string;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },

        hashPassword: {
            type: String,
            required: true,
        },

        walletAddress: {
            type: String,
            index: true,
            default: () => v4(),
        },

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

UserSchema.index({ username: 'text' });

export const User = model<IUser>('User', UserSchema);
