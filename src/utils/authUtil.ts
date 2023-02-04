import { NextFunction, Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';

export const createJWT = (payload: string): string => {
    return sign({ userId: payload }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

export const verifyJWT = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.appUser;
        if (!token) return res.status(401).json({ message: 'Unauthorized' })

        const decoded = verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        return next();
    }
}