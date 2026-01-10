import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '@/configs/env.config';
import { ERROR_CODES } from '@/constants/error-codes.constant';
import { STATUS_CODES } from '@/constants/statuscodes.constant';
import { ApiError } from '@/errors/ApiError.error';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const t = req.t;
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    if (!token && req.cookies?.access_token) {
        token = req.cookies.access_token;
    }

    if (!token) {
        throw new ApiError(
            STATUS_CODES.UNAUTHORIZED,
            ERROR_CODES.UNAUTHORIZED,
            t('unauthorized_message', { ns: 'error' }),
            t('unauthorized_details', { ns: 'error' }),
            t('unauthorized_suggestion', { ns: 'error' }),
        );
    }

    try {
        req.user = jwt.verify(token, env.app.JWT_SECRET);
        next();
    } catch (error) {
        throw new ApiError(
            STATUS_CODES.FORBIDDEN,
            ERROR_CODES.FORBIDDEN,
            t('forbidden_message', { ns: 'error' }),
            t('forbidden_details', { ns: 'error' }),
            t('forbidden_suggestion', { ns: 'error' }),
        );
    }
};
