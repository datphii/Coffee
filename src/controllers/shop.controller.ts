import { Request, Response, NextFunction } from 'express';
import { ShopService } from '../services/shop.service';

export class ShopController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const MOCK_SHOPS = [
                { id: 1, name: 'Datphi Coffee - Landmark 81', rating: 4.9, location: 'Tầng trệt Landmark 81, Vinhomes Central Park', is_open: true },
                { id: 2, name: 'Datphi Coffee - Hồ Con Rùa', rating: 4.7, location: '1 Phạm Ngọc Thạch, Quận 3, TP.HCM', is_open: true }
            ];

            try {
                const shops = await ShopService.getAllShops(req.query.open === 'true');
                res.json(shops.length > 0 ? shops : MOCK_SHOPS);
            } catch (e) {
                res.json(MOCK_SHOPS);
            }
        } catch (error) {
            next(error);
        }
    }

    static async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const shop = await ShopService.getShopById(Number(req.params.id));
            res.json(shop);
        } catch (error: any) {
            if (error.message === 'Shop not found') {
                res.status(404).json({ error: error.message });
            } else {
                next(error);
            }
        }
    }
}
