import { describe, it, expect, vi, beforeEach } from 'vitest'
import { registerController, loginController } from '../controllers/authController'
import type { Request, Response, NextFunction } from 'express'

vi.mock('../services/authService', () => ({
    register: vi.fn(),
    login: vi.fn(),
}))

import { register, login } from '../services/authService'

const mockRegister = vi.mocked(register)
const mockLogin = vi.mocked(login)

function mockRes(): Response {
    const res = {} as Response
    res.status = vi.fn().mockReturnThis()
    res.json = vi.fn().mockReturnThis()
    return res
}

beforeEach(() => {
    vi.clearAllMocks()
})

describe('registerController', () => {
    it('debe responder 201 con los datos del usuario', async () => {
        const userData = { id: 'uuid-1', email: 'daniel@gmail.com', nombre: 'Daniel' }
        mockRegister.mockResolvedValue(userData)

        const req = { body: { nombre: 'Daniel', email: 'daniel@gmail.com', password: '12345678' } } as Request
        const res = mockRes()
        const next = vi.fn() as NextFunction

        await registerController(req, res, next)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: userData })
        expect(next).not.toHaveBeenCalled()
    })

    it('debe llamar a next con el error si register falla', async () => {
        const error = new Error('El email ya esta')
        mockRegister.mockRejectedValue(error)

        const req = { body: {} } as Request
        const res = mockRes()
        const next = vi.fn() as NextFunction

        await registerController(req, res, next)

        expect(next).toHaveBeenCalledWith(error)
    })
})

describe('loginController', () => {
    it('debe responder 200 con el token', async () => {
        mockLogin.mockResolvedValue({ token: 'jwt-token' })

        const req = { body: { email: 'daniel@gmail.com', password: '12345678' } } as Request
        const res = mockRes()
        const next = vi.fn() as NextFunction

        await loginController(req, res, next)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: { token: 'jwt-token' } })
    })

    it('debe llamar a next con el error si login falla', async () => {
        const error = new Error('Credenciales inválidas')
        mockLogin.mockRejectedValue(error)

        const req = { body: {} } as Request
        const res = mockRes()
        const next = vi.fn() as NextFunction

        await loginController(req, res, next)

        expect(next).toHaveBeenCalledWith(error)
    })
})
