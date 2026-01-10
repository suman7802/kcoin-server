import { Router } from 'express';

import { getChain, mineBlock } from '@/controllers/crypto.controller';
import { authenticateToken } from '@/middlewares/auth.middleware';
import validateSchema from '@/middlewares/schema-validation.middleware';
import { getCryptoSchema } from '@/schemas/crypto.schema';

const cryptoRouter = Router();

cryptoRouter.get('/chain', validateSchema(getCryptoSchema), getChain);

cryptoRouter.get('/mine', authenticateToken, mineBlock);

export { cryptoRouter };
