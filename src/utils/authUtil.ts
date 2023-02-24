import { NextFunction, Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';

export const createJWT = (payload: string): string => {
    return sign({ userId: payload }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

export const verifyJWT = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.appUser;
        if (!token) return res.status(401).json({ message: 'No token unauthorized' })

        // try {

        const decoded = verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        // console.log('decoded: ', decoded);

        // const now = Date.now().valueOf() / 1000;
        // if (decoded.exp < now) {
        //     return res.status(401).json({ message: 'Unauthorized! Please login again' });
        // }

        // const newToken = createJWT(decoded.userId);

        // res.cookie('appUser', newToken, {
        //     sameSite: "lax",
        //     httpOnly: true,
        //     maxAge: 1000 * 60 * 60 * 24 * 30,
        //     secure: true
        // });

        return next();
        // } catch (err) {
        //     return res.status(401).json({ message: 'Session expired login again' })
        // }
    }
}