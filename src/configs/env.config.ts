import dotenvFlow from 'dotenv-flow';

import logger from '@/loggers/winston.logger';
import { envSchema } from '@/schemas/env.schema';

dotenvFlow.config();

const parsedEnv = envSchema.safeParse({
    app: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        LOG_LEVEL: process.env.LOG_LEVEL,
        CLIENT_URL: process.env.CLIENT_URL,
        API_KEY: process.env.API_KEY,
        DISABLE_RATE_LIMITER: process.env.DISABLE_RATE_LIMITER,
        DISABLE_VALIDATE_API_KEY_ON_DEVELOPMENT: process.env.DISABLE_VALIDATE_API_KEY_ON_DEVELOPMENT,
        JWT_SECRET: process.env.JWT_SECRET,
    },

    mongodb: {
        MONGODB_URI: process.env.MONGODB_URI,
    },
});

/**
 * Check if the environment variables are valid
 * If not, log the error and exit the process
 */
if (!parsedEnv.success) {
    logger.error(parsedEnv.error.errors);
    process.exit(1);
}

export const env = parsedEnv.data;
