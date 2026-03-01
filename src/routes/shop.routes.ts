import { Router } from 'express';
import { ShopController } from '../controllers/shop.controller';

const router = Router();

router.get('/', ShopController.getAll);
router.get('/:id', ShopController.getOne);

export default router;
