import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { OrderService } from '../services/order.service';

export class OrderController {
    static async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { shopId, items } = req.body;
            const userId = req.user!.id; // Authenticated by middleware

            const order = await OrderService.createOrder(userId, shopId, items);
            res.status(201).json(order);
        } catch (error: any) {
            if (error.message.includes('unavailable')) {
                res.status(400).json({ error: error.message });
            } else {
                next(error);
            }
        }
    }

    static async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const orderId = Number(req.params.id);
            const { status } = req.body;

            const order = await OrderService.updateStatus(orderId, status);
            res.json(order);
        } catch (error) {
            next(error);
        }
    }
}
