import { Router } from 'express';
import authRoutes from './auth.routes';
import shopRoutes from './shop.routes';
import drinkRoutes from './drink.routes';
import orderRoutes from './order.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/shops', shopRoutes);
router.use('/drinks', drinkRoutes);
router.use('/orders', orderRoutes);

export default router;
