import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import AuthConfig from '@config/Auth';
import AppError from '@shared/errors/AppError';

interface ITokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError('JWT token is missing.', 401);
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = verify(token, AuthConfig.jwt.secret);

        const { sub } = decoded as ITokenPayload;

        req.user = {
            id: sub,
        };

        return next();
    } catch {
        throw new AppError('Invalid JWT token.', 401);
    }
}
