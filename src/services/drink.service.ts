import { prisma } from '../config/db';

export class DrinkService {
    static async getDrinks(filters: { shopId?: number; categoryId?: number }) {
        const whereClause: any = {};
        if (filters.shopId) whereClause.shop_id = filters.shopId;
        if (filters.categoryId) whereClause.category_id = filters.categoryId;

        return prisma.drink.findMany({ where: whereClause, include: { category: true } });
    }
}
