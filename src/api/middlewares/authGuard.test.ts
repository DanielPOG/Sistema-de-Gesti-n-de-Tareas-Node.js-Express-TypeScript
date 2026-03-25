import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authGuard } from '../../api/middlewares/authGuard'
import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'

vi.mock('../../config/env', () => ({
    config: {
        jwtSecret: 'test-secret',
    },
}))

beforeEach(() => {
    vi.clearAllMocks()
})

describe('authGuard middleware', () => {
    it('debe inyectar req.user si el token es válido', () => {
        const token = jwt.sign({ userId: 'user-1' }, 'test-secret')

        const req = {
            headers: { authorization: `Bearer ${token}` },
        } as Request
        const res = {} as Response
        const next = vi.fn() as NextFunction

        authGuard(req, res, next)

        expect(req.user).toEqual({ userId: 'user-1' })
        expect(next).toHaveBeenCalledWith()
    })

    it('debe llamar next con AuthenticationError si no hay header', () => {
        const req = { headers: {} } as Request
        const res = {} as Response
        const next = vi.fn() as NextFunction

        authGuard(req, res, next)

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 401,
                message: 'Token no proporcionado',
            })
        )
    })

    it('debe llamar next con AuthenticationError si el header no tiene Bearer', () => {
        const req = {
            headers: { authorization: 'Basic abc123' },
        } as Request
        const res = {} as Response
        const next = vi.fn() as NextFunction

        authGuard(req, res, next)

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 401,
                message: 'Token no proporcionado',
            })
        )
    })

    it('debe llamar next con AuthenticationError si el token es inválido', () => {
        const req = {
            headers: { authorization: 'Bearer token-invalido' },
        } as Request
        const res = {} as Response
        const next = vi.fn() as NextFunction

        authGuard(req, res, next)

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 401,
                message: 'Token inválido o expirado',
            })
        )
    })

    it('debe llamar next con AuthenticationError si el token está expirado', () => {
        const token = jwt.sign({ userId: 'user-1' }, 'test-secret', { expiresIn: '0s' })

        const req = {
            headers: { authorization: `Bearer ${token}` },
        } as Request
        const res = {} as Response
        const next = vi.fn() as NextFunction

        // Pequeño delay para asegurar que el token expire
        authGuard(req, res, next)

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 401,
                message: 'Token inválido o expirado',
            })
        )
    })
})
