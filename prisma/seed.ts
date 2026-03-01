import { prisma } from '../src/config/db';

async function main() {
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.drink.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.shop.deleteMany({});
  await prisma.user.deleteMany({});

  // Cửa hàng mẫu
  const shop1 = await prisma.shop.create({
    data: {
      name: 'Highlands Coffee - Landmark 81',
      rating: 4.9,
      location: 'Tầng trệt Landmark 81, Vinhomes Central Park',
      is_open: true,
    },
  });

  const shop2 = await prisma.shop.create({
    data: {
      name: 'Highlands Coffee - Hồ Con Rùa',
      rating: 4.7,
      location: '1 Phạm Ngọc Thạch, Quận 3, TP.HCM',
      is_open: true,
    },
  });

  // Categories
  const catCoffee = await prisma.category.create({ data: { name: 'Cà Phê Phin', icon: '☕' } });
  const catPhindi = await prisma.category.create({ data: { name: 'Phindi', icon: '🥤' } });
  const catTea = await prisma.category.create({ data: { name: 'Trà', icon: '🍵' } });
  const catFreeze = await prisma.category.create({ data: { name: 'Freeze', icon: '🧊' } });

  // Drinks - Menu Highlands
  await prisma.drink.createMany({
    data: [
      // Phin
      { name: 'Phin Sữa Đá', description: 'Cà phê rang xay nguyên bản kết hợp cùng sữa đặc.', price: 29000, shop_id: shop1.id, category_id: catCoffee.id, stock_quantity: 100 },
      { name: 'Phin Đen Đá', description: 'Cà phê đen đậm đà dành cho những người thích vị mạnh.', price: 29000, shop_id: shop1.id, category_id: catCoffee.id, stock_quantity: 100 },
      { name: 'Bạc Xỉu Đá', description: 'Phù hợp với những ai thích vị cà phê nhẹ nhàng hòa cùng vị sữa ngọt ngào.', price: 29000, shop_id: shop1.id, category_id: catCoffee.id, stock_quantity: 100 },

      // Phindi
      { name: 'Phindi Hạnh Nhân', description: 'Cà phê Phin thế hệ mới kết hợp cùng Hạnh Nhân thơm bùi.', price: 45000, shop_id: shop1.id, category_id: catPhindi.id, stock_quantity: 100 },
      { name: 'Phindi Choco', description: 'Cà phê Phin kết hợp cùng sô cô la ngọt ngào.', price: 45000, shop_id: shop1.id, category_id: catPhindi.id, stock_quantity: 100 },

      // Trà
      { name: 'Trà Sen Vàng', description: 'Sự kết hợp hoàn hảo giữa trà Ô Long, hạt sen thơm bùi và củ năng giòn.', price: 45000, shop_id: shop2.id, category_id: catTea.id, stock_quantity: 100 },
      { name: 'Trà Thạch Đào', description: 'Vị trà thanh mát kết hợp với những miếng đào ngọt lịm.', price: 45000, shop_id: shop2.id, category_id: catTea.id, stock_quantity: 100 },
      { name: 'Trà Thanh Đào', description: 'Thức uống giải khát mát lạnh với hương vị đào tươi.', price: 45000, shop_id: shop2.id, category_id: catTea.id, stock_quantity: 100 },

      // Freeze
      { name: 'Freeze Trà Xanh', description: 'Thức uống đá xay hương vị trà xanh matcha thơm lừng.', price: 55000, shop_id: shop2.id, category_id: catFreeze.id, stock_quantity: 100 },
      { name: 'Caramel Phin Freeze', description: 'Đá xay từ cà phê Phin pha với caramel ngọt ngào.', price: 55000, shop_id: shop2.id, category_id: catFreeze.id, stock_quantity: 100 },
    ],
  });

  console.log('Đã tạo dữ liệu mẫu thành công! Bao gồm 2 cửa hàng, 4 danh mục và 10 thức uống chuẩn Highlands Coffee.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
