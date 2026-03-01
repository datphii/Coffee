"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    // Clear existing to avoid unique constraint if re-seeded
    // Note: Care in production, but for scaffolding this is great.
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.drink.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.shop.deleteMany({});
    await prisma.user.deleteMany({});
    // Create 2 Shops
    const shop1 = await prisma.shop.create({
        data: {
            name: 'Downtown Roastery',
            rating: 4.8,
            location: '123 Main St',
            is_open: true,
        },
    });
    const shop2 = await prisma.shop.create({
        data: {
            name: 'Uptown Tea Lounge',
            rating: 4.5,
            location: '456 High St',
            is_open: true,
        },
    });
    // Create Categories
    const coffeeCat = await prisma.category.create({ data: { name: 'Coffee', icon: '☕' } });
    const teaCat = await prisma.category.create({ data: { name: 'Tea', icon: '🍵' } });
    // Create 5 Coffees for Shop 1
    await prisma.drink.createMany({
        data: [
            { name: 'Espresso', description: 'Strong black coffee', price: 2.5, shop_id: shop1.id, category_id: coffeeCat.id, stock_quantity: 100 },
            { name: 'Americano', description: 'Diluted espresso', price: 3.0, shop_id: shop1.id, category_id: coffeeCat.id, stock_quantity: 100 },
            { name: 'Latte', description: 'Espresso with milk', price: 4.0, shop_id: shop1.id, category_id: coffeeCat.id, stock_quantity: 100 },
            { name: 'Cappuccino', description: 'Espresso with foamed milk', price: 4.5, shop_id: shop1.id, category_id: coffeeCat.id, stock_quantity: 100 },
            { name: 'Mocha', description: 'Chocolate flavored coffee', price: 5.0, shop_id: shop1.id, category_id: coffeeCat.id, stock_quantity: 100 },
        ],
    });
    // Create 3 Teas for Shop 2
    await prisma.drink.createMany({
        data: [
            { name: 'Green Tea', description: 'Refreshing green tea', price: 3.0, shop_id: shop2.id, category_id: teaCat.id, stock_quantity: 100 },
            { name: 'Black Tea', description: 'Strong black tea', price: 3.0, shop_id: shop2.id, category_id: teaCat.id, stock_quantity: 100 },
            { name: 'Earl Grey', description: 'Flavored black tea', price: 3.5, shop_id: shop2.id, category_id: teaCat.id, stock_quantity: 100 },
        ],
    });
    console.log('Database safely seeded! Added 2 shops, 2 categories, and 8 drinks.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
