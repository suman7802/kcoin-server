import { User } from '@/models/user.model';
import { authType } from '@/schemas/auth.schema';

export const _regesterUser = async (payload: authType['body']) => {
    return User.create({
        username: payload.username,
        hashPassword: payload.password,
    });
};

export const _getUser = async (username: string) => {
    return User.findOne({
        username,
    });
};
