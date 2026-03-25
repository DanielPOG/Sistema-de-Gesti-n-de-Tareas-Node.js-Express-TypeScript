import { describe, it, expect } from 'vitest'
import {
    AppError,
    NotFoundError,
    AuthenticationError,
    AuthorizationError,
    ValidationError,
    ConflictError,
} from '../errors/AppError'

describe('AppError', () => {
    it('debe crear un error con message y statusCode', () => {
        const error = new AppError('algo falló', 500)
        expect(error).toBeInstanceOf(Error)
        expect(error).toBeInstanceOf(AppError)
        expect(error.message).toBe('algo falló')
        expect(error.statusCode).toBe(500)
        expect(error.name).toBe('AppError')
    })
})

describe('NotFoundError', () => {
    it('debe tener statusCode 404 y mensaje por defecto', () => {
        const error = new NotFoundError()
        expect(error).toBeInstanceOf(AppError)
        expect(error.statusCode).toBe(404)
        expect(error.message).toBe('Recurso no encontrado')
        expect(error.name).toBe('NotFoundError')
    })

    it('debe aceptar un mensaje personalizado', () => {
        const error = new NotFoundError('Tarea no encontrada')
        expect(error.message).toBe('Tarea no encontrada')
        expect(error.statusCode).toBe(404)
    })
})

describe('AuthenticationError', () => {
    it('debe tener statusCode 401 y mensaje por defecto', () => {
        const error = new AuthenticationError()
        expect(error).toBeInstanceOf(AppError)
        expect(error.statusCode).toBe(401)
        expect(error.message).toBe('No autenticado')
    })
})

describe('AuthorizationError', () => {
    it('debe tener statusCode 403 y mensaje por defecto', () => {
        const error = new AuthorizationError()
        expect(error).toBeInstanceOf(AppError)
        expect(error.statusCode).toBe(403)
        expect(error.message).toBe('No tienes permiso para realizar esta acción')
    })
})

describe('ValidationError', () => {
    it('debe tener statusCode 400 y mensaje por defecto', () => {
        const error = new ValidationError()
        expect(error).toBeInstanceOf(AppError)
        expect(error.statusCode).toBe(400)
        expect(error.message).toBe('Datos inválidos')
    })
})

describe('ConflictError', () => {
    it('debe tener statusCode 409 y mensaje por defecto', () => {
        const error = new ConflictError()
        expect(error).toBeInstanceOf(AppError)
        expect(error.statusCode).toBe(409)
        expect(error.message).toBe('El recurso ya existe')
    })
})
