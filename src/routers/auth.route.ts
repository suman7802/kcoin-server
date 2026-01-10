import { Router } from 'express';

import { login, regester } from '@/controllers/auth.controller';
import validateSchema from '@/middlewares/schema-validation.middleware';
import { authSchema } from '@/schemas/auth.schema';
const authRouter = Router();

authRouter.post('/register', validateSchema(authSchema), regester);
authRouter.post('/login', validateSchema(authSchema), login);

export { authRouter };
