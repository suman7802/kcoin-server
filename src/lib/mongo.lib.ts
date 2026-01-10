import mongoose from 'mongoose';

import { env } from '@/configs/env.config';
import logger from '@/loggers/winston.logger';

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(env.mongodb.MONGODB_URI);
        logger.info('MongoDB connected successfully');
    } catch (err) {
        logger.error(`MongoDB connection failed: ${(err as Error).message}`);
        process.exit(1);
    }
};
