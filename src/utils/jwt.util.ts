import jwt from 'jsonwebtoken';

import { env } from '@/configs/env.config';

export const signJwt = (payload: object): string => jwt.sign(payload, env.app.JWT_SECRET, { expiresIn: '1d' });
export const verifyJwt = (token: string): any => jwt.verify(token, env.app.JWT_SECRET);
