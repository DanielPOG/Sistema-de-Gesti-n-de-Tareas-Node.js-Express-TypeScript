import { describe, it, expect } from 'vitest'
import {
    registerSchema,
    loginSchema,
    createTaskSchema,
    updateTaskSchema,
} from '../utils/schemas'

describe('registerSchema', () => {
    it('debe validar datos correctos', () => {
        const result = registerSchema.safeParse({
            nombre: 'Daniel',
            email: 'daniel@gmail.com',
            password: '12345678',
        })
        expect(result.success).toBe(true)
    })

    it('debe rechazar nombre menor a 2 caracteres', () => {
        const result = registerSchema.safeParse({
            nombre: 'D',
            email: 'daniel@gmail.com',
            password: '12345678',
        })
        expect(result.success).toBe(false)
    })

    it('debe rechazar email inválido', () => {
        const result = registerSchema.safeParse({
            nombre: 'Daniel',
            email: 'no-es-email',
            password: '12345678',
        })
        expect(result.success).toBe(false)
    })

    it('debe rechazar password menor a 8 caracteres', () => {
        const result = registerSchema.safeParse({
            nombre: 'Daniel',
            email: 'daniel@gmail.com',
            password: '1234',
        })
        expect(result.success).toBe(false)
    })

    it('debe rechazar campos faltantes', () => {
        const result = registerSchema.safeParse({})
        expect(result.success).toBe(false)
    })
})

describe('loginSchema', () => {
    it('debe validar datos correctos', () => {
        const result = loginSchema.safeParse({
            email: 'daniel@gmail.com',
            password: '12345678',
        })
        expect(result.success).toBe(true)
    })

    it('debe rechazar email inválido', () => {
        const result = loginSchema.safeParse({
            email: 'invalid',
            password: '12345678',
        })
        expect(result.success).toBe(false)
    })

    it('debe rechazar password vacío', () => {
        const result = loginSchema.safeParse({
            email: 'daniel@gmail.com',
            password: '',
        })
        expect(result.success).toBe(false)
    })
})

describe('createTaskSchema', () => {
    it('debe validar con solo titulo', () => {
        const result = createTaskSchema.safeParse({ titulo: 'Estudiar' })
        expect(result.success).toBe(true)
    })

    it('debe validar con todos los campos', () => {
        const result = createTaskSchema.safeParse({
            titulo: 'Estudiar',
            descripcion: 'TypeScript',
            fechaVencimiento: '2025-12-31T00:00:00.000Z',
        })
        expect(result.success).toBe(true)
    })

    it('debe rechazar titulo vacío', () => {
        const result = createTaskSchema.safeParse({ titulo: '' })
        expect(result.success).toBe(false)
    })

    it('debe rechazar fechaVencimiento con formato inválido', () => {
        const result = createTaskSchema.safeParse({
            titulo: 'Test',
            fechaVencimiento: 'no-es-fecha',
        })
        expect(result.success).toBe(false)
    })
})

describe('updateTaskSchema', () => {
    it('debe validar objeto vacío (todos opcionales)', () => {
        const result = updateTaskSchema.safeParse({})
        expect(result.success).toBe(true)
    })

    it('debe validar estado válido', () => {
        const result = updateTaskSchema.safeParse({ estado: 'en_curso' })
        expect(result.success).toBe(true)
    })

    it('debe rechazar estado inválido', () => {
        const result = updateTaskSchema.safeParse({ estado: 'invalido' })
        expect(result.success).toBe(false)
    })

    it('debe validar todos los estados permitidos', () => {
        for (const estado of ['pendiente', 'en_curso', 'completada']) {
            const result = updateTaskSchema.safeParse({ estado })
            expect(result.success).toBe(true)
        }
    })
})
