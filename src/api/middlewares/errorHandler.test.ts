import { describe, it, expect, vi, beforeEach } from 'vitest'
import { errorHandler } from '../../api/middlewares/errorHandler'
import { AppError, NotFoundError } from '../../errors/AppError'
import type { Request, Response, NextFunction } from 'express'

function mockRes(): Response {
    const res = {} as Response
    res.status = vi.fn().mockReturnThis()
    res.json = vi.fn().mockReturnThis()
    return res
}

beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => { })
})

describe('errorHandler', () => {
    it('debe responder con statusCode y message de AppError', () => {
        const err = new NotFoundError('Tarea no encontrada')
        const res = mockRes()

        errorHandler(err, {} as Request, res, vi.fn() as NextFunction)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            name: 'NotFoundError',
            message: 'Tarea no encontrada',
        })
    })

    it('debe responder 500 para errores no controlados', () => {
        const err = new Error('algo inesperado')
        const res = mockRes()

        errorHandler(err, {} as Request, res, vi.fn() as NextFunction)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            name: 'InternalServerError',
            message: 'Error interno del servidor',
        })
    })

    it('debe manejar AppError genérico correctamente', () => {
        const err = new AppError('Custom', 422)
        const res = mockRes()

        errorHandler(err, {} as Request, res, vi.fn() as NextFunction)

        expect(res.status).toHaveBeenCalledWith(422)
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            name: 'AppError',
            message: 'Custom',
        })
    })
})
