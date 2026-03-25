import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../../config/env'
import { AuthenticationError } from '../../errors/AppError'

interface JwtPayload {
    userId: string
}

// Extiende el tipo de Request para que TypeScript sepa que req.user existe
declare global {
    namespace Express {
        interface Request {
            user?: { userId: string }
        }
    }
}

/**
 * Middleware que protege rutas verificando el JWT del header Authorization.
 * Si el token es válido, agrega `req.user` con el `userId` del payload.
 */
export const authGuard = (req: Request, _res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        next(new AuthenticationError('Token no proporcionado'))
        return
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, config.jwtSecret) as JwtPayload
        req.user = { userId: payload.userId }
        next()
    } catch {
        next(new AuthenticationError('Token inválido o expirado'))
    }
}