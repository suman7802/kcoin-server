import { z } from 'zod';

/**
 * @description
 *  truthy values are values that are considered true
 *  in the context of environment variables
 */
const TRUTHY_VALUES = ['true', 't', '1'];

export const envSchema = z.object({
    app: z.object({
        NODE_ENV: z.enum(['development', 'production', 'test']),
        PORT: z.string().transform(Number),
        /***
         * log levels are options according to morgan
         *  for more info visit https://github.com/expressjs/morgan#readme
         */
        LOG_LEVEL: z.enum(['dev', 'short', 'combined', 'common', 'short', 'tiny']),
        CLIENT_URL: z.string().url(),
        API_KEY: z.string(),
        DISABLE_RATE_LIMITER: z.string().transform((val) => {
            return TRUTHY_VALUES.includes(val.toLowerCase());
        }),
        DISABLE_VALIDATE_API_KEY_ON_DEVELOPMENT: z.string().transform((val) => {
            return TRUTHY_VALUES.includes(val.toLowerCase());
        }),
        JWT_SECRET: z.string(),
    }),

    mongodb: z.object({
        MONGODB_URI: z.string(),
    }),
});

export type envType = z.TypeOf<typeof envSchema>;
