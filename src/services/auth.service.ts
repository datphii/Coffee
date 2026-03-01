import { prisma } from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export class AuthService {
    static async signup(data: any) {
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) throw new Error('Email already in use');

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });

        return { id: user.id, name: user.name, email: user.email, role: user.role };
    }

    static async login(data: any) {
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user) throw new Error('Invalid email or password');

        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) throw new Error('Invalid email or password');

        const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {
            expiresIn: '1d',
        });

        return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
    }
}
