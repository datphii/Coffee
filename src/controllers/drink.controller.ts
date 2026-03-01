import { Request, Response, NextFunction } from 'express';
import { DrinkService } from '../services/drink.service';

export class DrinkController {
    static async getDrinks(req: Request, res: Response, next: NextFunction) {
        try {
            const MOCK_DRINKS = [
                { id: 1, name: 'Phin Sữa Đá', description: 'Cà phê rang xay nguyên bản kết hợp cùng sữa đặc.', price: 29000, shopId: 1, categoryId: 1, stock_quantity: 100 },
                { id: 2, name: 'Phin Đen Đá', description: 'Cà phê đen đậm đà dành cho những người thích vị mạnh.', price: 29000, shopId: 1, categoryId: 1, stock_quantity: 100 },
                { id: 3, name: 'Bạc Xỉu Đá', description: 'Phù hợp với những ai thích vị cà phê nhẹ nhàng hòa cùng vị sữa ngọt ngào.', price: 29000, shopId: 1, categoryId: 1, stock_quantity: 100 },
                { id: 4, name: 'Phindi Hạnh Nhân', description: 'Cà phê Phin thế hệ mới kết hợp cùng Hạnh Nhân thơm bùi.', price: 45000, shopId: 1, categoryId: 2, stock_quantity: 100 },
                { id: 5, name: 'Phindi Choco', description: 'Cà phê Phin kết hợp cùng sô cô la ngọt ngào.', price: 45000, shopId: 1, categoryId: 2, stock_quantity: 100 },
                { id: 6, name: 'Trà Sen Vàng', description: 'Sự kết hợp hoàn hảo giữa trà Ô Long, hạt sen thơm bùi và củ năng giòn.', price: 45000, shopId: 2, categoryId: 3, stock_quantity: 100 },
                { id: 7, name: 'Trà Thạch Đào', description: 'Vị trà thanh mát kết hợp với những miếng đào ngọt lịm.', price: 45000, shopId: 2, categoryId: 3, stock_quantity: 100 },
                { id: 8, name: 'Trà Thanh Đào', description: 'Thức uống giải khát mát lạnh với hương vị đào tươi.', price: 45000, shopId: 2, categoryId: 3, stock_quantity: 100 },
                { id: 9, name: 'Freeze Trà Xanh', description: 'Thức uống đá xay hương vị trà xanh matcha thơm lừng.', price: 55000, shopId: 2, categoryId: 4, stock_quantity: 100 },
                { id: 10, name: 'Caramel Phin Freeze', description: 'Đá xay từ cà phê Phin pha với caramel ngọt ngào.', price: 55000, shopId: 2, categoryId: 4, stock_quantity: 100 }
            ];

            try {
                const drinks = await DrinkService.getDrinks({ shopId: req.query.shopId ? Number(req.query.shopId) : undefined });
                res.json(drinks.length > 0 ? drinks : MOCK_DRINKS);
            } catch (e) {
                res.json(MOCK_DRINKS);
            }
        } catch (error) {
            next(error);
        }
    }
}
