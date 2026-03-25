import { Request, Response, NextFunction } from 'express'
import { register, login } from '../services/authService'
import { RegisterDto, LoginDto } from '../utils/schemas'

/**
 * POST /auth/register
 * Registra un nuevo usuario y retorna sus datos básicos.
 */
export const registerController = async (
    req: Request<{}, {}, RegisterDto>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = await register(req.body)
        res.status(201).json({ status: 'success', data: user })
    } catch (error) {
        next(error)
    }
}

/**
 * POST /auth/login
 * Verifica credenciales y retorna un JWT.
 */
export const loginController = async (
    req: Request<{}, {}, LoginDto>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await login(req.body)
        res.status(200).json({ status: 'success', data: result })
    } catch (error) {
        next(error)
    }
}