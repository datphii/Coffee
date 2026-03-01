import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    static async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await AuthService.signup(req.body);
            res.status(201).json({ message: 'User created successfully', user });
        } catch (error: any) {
            if (error.message === 'Email already in use') {
                res.status(400).json({ error: error.message });
            } else {
                next(error);
            }
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AuthService.login(req.body);
            res.json(result);
        } catch (error: any) {
            if (error.message === 'Invalid email or password') {
                res.status(401).json({ error: error.message });
            } else {
                next(error);
            }
        }
    }
}
