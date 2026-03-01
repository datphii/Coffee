import { prisma } from '../config/db';

export class OrderService {
    static async createOrder(userId: number, shopId: number, items: { drinkId: number, quantity: number }[]) {
        return prisma.$transaction(async (tx) => {
            // 1. Fetch requested drinks to safely calculate total server-side
            const drinkIds = items.map(i => i.drinkId);
            const drinks = await tx.drink.findMany({
                where: { id: { in: drinkIds }, shop_id: shopId }
            });

            if (drinks.length !== items.length) {
                throw new Error('Some requested drinks are invalid or unavailable at this shop');
            }

            // 2. Map prices and compute total
            const orderItemsData = items.map(item => {
                const drink = drinks.find(d => d.id === item.drinkId)!;
                return {
                    drink_id: drink.id,
                    quantity: item.quantity,
                    price_per_unit: drink.price,
                };
            });

            const totalPrice = orderItemsData.reduce(
                (acc, item) => acc + (Number(item.price_per_unit) * item.quantity),
                0
            );

            // 3. Create the Order and OrderItems atomically
            const order = await tx.order.create({
                data: {
                    user_id: userId,
                    shop_id: shopId,
                    total_price: totalPrice,
                    orderItems: {
                        create: orderItemsData,
                    },
                },
                include: { orderItems: true },
            });

            return order;
        });
    }

    static async updateStatus(orderId: number, status: string) {
        return prisma.order.update({
            where: { id: orderId },
            data: { status },
        });
    }
}
