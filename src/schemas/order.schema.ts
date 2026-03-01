import { z } from 'zod';

export const createOrderSchema = z.object({
    body: z.object({
        shopId: z.number().int().positive(),
        items: z.array(z.object({
            drinkId: z.number().int().positive(),
            quantity: z.number().int().positive(),
        })).min(1),
    }),
});

export const updateOrderStatusSchema = z.object({
    body: z.object({
        status: z.enum(['Pending', 'Processing', 'Out for Delivery', 'Completed']),
    }),
});
