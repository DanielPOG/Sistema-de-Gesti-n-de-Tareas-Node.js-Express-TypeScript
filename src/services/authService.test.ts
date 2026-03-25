import { describe, it, expect, vi, beforeEach } from 'vitest'
import { register, login } from '../services/authService'

// Mocks
vi.mock('../persistence/userRepository', () => ({
    findUserByEmail: vi.fn(),
    createUser: vi.fn(),
}))

vi.mock('../config/env', () => ({
    config: {
        jwtSecret: 'test-secret',
        jwtExpiresIn: '7d',
    },
}))

import { findUserByEmail, createUser } from '../persistence/userRepository'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const mockFindUserByEmail = vi.mocked(findUserByEmail)
const mockCreateUser = vi.mocked(createUser)

beforeEach(() => {
    vi.clearAllMocks()
})

describe('authService - register', () => {
    const registerData = {
        nombre: 'Daniel',
        email: 'daniel@gmail.com',
        password: '12345678',
    }

    it('debe registrar un usuario nuevo correctamente', async () => {
        mockFindUserByEmail.mockResolvedValue(null)
        mockCreateUser.mockResolvedValue({
            id: 'uuid-1',
            nombre: 'Daniel',
            email: 'daniel@gmail.com',
            password: 'hashed',
            createdAt: new Date(),
        })

        const result = await register(registerData)

        expect(mockFindUserByEmail).toHaveBeenCalledWith('daniel@gmail.com')
        expect(mockCreateUser).toHaveBeenCalledOnce()
        expect(result).toEqual({
            id: 'uuid-1',
            email: 'daniel@gmail.com',
            nombre: 'Daniel',
        })
        // Verifica que la contraseña fue hasheada (no se guarda en texto plano)
        const createArg = mockCreateUser.mock.calls[0][0]
        expect(createArg.password).not.toBe('12345678')
    })

    it('debe lanzar ConflictError si el email ya existe', async () => {
        mockFindUserByEmail.mockResolvedValue({
            id: 'uuid-1',
            nombre: 'Daniel',
            email: 'daniel@gmail.com',
            password: 'hashed',
            createdAt: new Date(),
        })

        await expect(register(registerData)).rejects.toThrow('El email ya esta')
    })
})

describe('authService - login', () => {
    const loginData = {
        email: 'daniel@gmail.com',
        password: '12345678',
    }

    it('debe retornar un token con credenciales válidas', async () => {
        const hashed = await bcrypt.hash('12345678', 10)
        mockFindUserByEmail.mockResolvedValue({
            id: 'uuid-1',
            nombre: 'Daniel',
            email: 'daniel@gmail.com',
            password: hashed,
            createdAt: new Date(),
        })

        const result = await login(loginData)

        expect(result).toHaveProperty('token')
        expect(typeof result.token).toBe('string')

        // Verifica que el token contenga el userId
        const decoded = jwt.verify(result.token, 'test-secret') as { userId: string }
        expect(decoded.userId).toBe('uuid-1')
    })

    it('debe lanzar AuthenticationError si el usuario no existe', async () => {
        mockFindUserByEmail.mockResolvedValue(null)

        await expect(login(loginData)).rejects.toThrow('Credenciales inválidas')
    })

    it('debe lanzar AuthenticationError si la contraseña es incorrecta', async () => {
        const hashed = await bcrypt.hash('otrapassword', 10)
        mockFindUserByEmail.mockResolvedValue({
            id: 'uuid-1',
            nombre: 'Daniel',
            email: 'daniel@gmail.com',
            password: hashed,
            createdAt: new Date(),
        })

        await expect(login(loginData)).rejects.toThrow('Credenciales inválidas')
    })
})
