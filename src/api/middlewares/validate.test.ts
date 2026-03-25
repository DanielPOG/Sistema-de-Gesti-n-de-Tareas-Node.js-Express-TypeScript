import { describe, it, expect, vi, beforeEach } from 'vitest'
import { validate } from '../../api/middlewares/validate'
import { registerSchema } from '../../utils/schemas'
import type { Request, Response, NextFunction } from 'express'

beforeEach(() => {
    vi.clearAllMocks()
})

describe('validate middleware', () => {
    const middleware = validate(registerSchema)

    it('debe llamar next() si los datos son válidos', () => {
        const req = {
            body: { nombre: 'Daniel', email: 'daniel@gmail.com', password: '12345678' },
        } as Request
        const res = {} as Response
        const next = vi.fn() as NextFunction

        middleware(req, res, next)

        expect(next).toHaveBeenCalledWith()
        // Verifica que el body fue reemplazado con los datos parseados
        expect(req.body).toEqual({
            nombre: 'Daniel',
            email: 'daniel@gmail.com',
            password: '12345678',
        })
    })

    it('debe llamar next con ValidationError si los datos son inválidos', () => {
        const req = { body: { nombre: 'D', email: 'invalid', password: '123' } } as Request
        const res = {} as Response
        const next = vi.fn() as NextFunction

        middleware(req, res, next)

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 400 })
        )
    })

    it('debe llamar next con ValidationError si el body está vacío', () => {
        const req = { body: {} } as Request
        const res = {} as Response
        const next = vi.fn() as NextFunction

        middleware(req, res, next)

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 400 })
        )
    })
})
