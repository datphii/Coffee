import { prisma } from '../config/db';

export class ShopService {
    static async getAllShops(isOpenOnly: boolean = false) {
        const whereClause = isOpenOnly ? { is_open: true } : {};
        return prisma.shop.findMany({ where: whereClause });
    }

    static async getShopById(id: number) {
        const shop = await prisma.shop.findUnique({
            where: { id },
            include: { drinks: true }
        });
        if (!shop) throw new Error('Shop not found');
        return shop;
    }
}
