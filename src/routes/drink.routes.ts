import { Router } from 'express';
import { DrinkController } from '../controllers/drink.controller';

const router = Router();

router.get('/', DrinkController.getDrinks);

export default router;
