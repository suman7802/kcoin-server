import { Request, Response } from 'express';

import { env } from '@/configs/env.config';
import { ERROR_CODES } from '@/constants/error-codes.constant';
import { STATUS_CODES } from '@/constants/statuscodes.constant';
import { ApiError } from '@/errors/ApiError.error';
import asyncCatch from '@/errors/asyncCatch.error';
import { authType } from '@/schemas/auth.schema';
import { _getUser, _regesterUser } from '@/services/user.service';
import { getHashPassword } from '@/utils/crypto.util';
import { customSuccessResponse } from '@/utils/customSuccessResponse.util';
import { signJwt } from '@/utils/jwt.util';

export const regester = asyncCatch(async (req: Request<{}, {}, authType['body'], {}>, res: Response) => {
    const t = req.t;
    const { username, password } = req.body;

    const hashPassword = getHashPassword(password);

    const user = await _regesterUser({
        username,
        password: hashPassword,
    });

    customSuccessResponse(res, 200, t('user_regestered', { ns: 'auth' }), {
        username: user.username,
        walletAddress: user.walletAddress,
    });
});

export const login = asyncCatch(async (req: Request<{}, {}, authType['body'], {}>, res: Response) => {
    const t = req.t;
    const { username, password } = req.body;

    const user = await _getUser(username);

    if (!user) {
        throw new ApiError(
            STATUS_CODES.NOT_FOUND,
            ERROR_CODES.NOT_FOUND,
            t('user_not_found_message', { ns: 'error' }),
            t('user_not_found_details', { ns: 'error' }),
            t('user_not_found_suggestion', { ns: 'error' }),
        );
    }

    const hashPassword = getHashPassword(password);

    if (hashPassword !== user.hashPassword) {
        throw new ApiError(
            STATUS_CODES.UNAUTHORIZED,
            ERROR_CODES.UNAUTHORIZED,
            t('invalid_credentials_message', { ns: 'error' }),
            t('invalid_credentials_details', { ns: 'error' }),
            t('invalid_credentials_suggestion', { ns: 'error' }),
        );
    }

    const token = signJwt({
        id: user._id.toString(),
        walletAddress: user.walletAddress,
    });

    res.cookie('access_token', token, {
        httpOnly: true,
        secure: env.app.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000,
    });

    customSuccessResponse(res, 200, t('login_success', { ns: 'auth' }), {
        username: user.username,
        walletAddress: user.walletAddress,
    });
});

export const logout = asyncCatch(async (req: Request, res: Response) => {
    const t = req.t;

    res.clearCookie('access_token', {
        httpOnly: true,
        secure: env.app.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });

    customSuccessResponse(res, 200, t('logout_success', { ns: 'auth' }));
});
