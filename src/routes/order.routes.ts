import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createOrderSchema, updateOrderStatusSchema } from '../schemas/order.schema';

const router = Router();

// Only authenticated customers can create orders
router.post('/', authenticate, authorize(['Customer', 'Admin']), validate(createOrderSchema), OrderController.createOrder);

// Only Admins or Barista/Riders can change status
router.patch('/:id/status', authenticate, authorize(['Admin', 'Barista', 'Rider']), validate(updateOrderStatusSchema), OrderController.updateStatus);

export default router;
