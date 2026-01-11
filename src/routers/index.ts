import { Router } from 'express';

import { authRouter } from '@/routers/auth.route';
import { healthRouter } from '@/routers/health.route';

import { cryptoRouter } from './block.route';
import { transactionRouter } from './transaction.route';

const router = Router();

router.use('/health', healthRouter);

router.use('/auth', authRouter);
router.use('/crypto', cryptoRouter);
router.use('/transaction', transactionRouter);

export default router;
