import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    createTaskController,
    getAllTasksController,
    getOneTaskController,
    updateTaskController,
    deleteTaskController,
} from '../controllers/taskController'
import type { Request, Response, NextFunction } from 'express'

vi.mock('../services/taskService', () => ({
    create: vi.fn(),
    getAll: vi.fn(),
    getOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
}))

import { create, getAll, getOne, update, remove } from '../services/taskService'

const mockCreate = vi.mocked(create)
const mockGetAll = vi.mocked(getAll)
const mockGetOne = vi.mocked(getOne)
const mockUpdate = vi.mocked(update)
const mockRemove = vi.mocked(remove)

function mockRes(): Response {
    const res = {} as Response
    res.status = vi.fn().mockReturnThis()
    res.json = vi.fn().mockReturnThis()
    res.send = vi.fn().mockReturnThis()
    return res
}

const fakeTask = {
    id: 'task-1',
    titulo: 'Test',
    descripcion: null,
    fechaVencimiento: null,
    estado: 'pendiente' as const,
    userId: 'user-1',
    createdAt: new Date(),
}

beforeEach(() => {
    vi.clearAllMocks()
})

describe('createTaskController', () => {
    it('debe responder 201 con la tarea creada', async () => {
        mockCreate.mockResolvedValue(fakeTask)

        const req = { body: { titulo: 'Test' }, user: { userId: 'user-1' } } as Request
        const res = mockRes()
        const next = vi.fn() as NextFunction

        await createTaskController(req, res, next)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: fakeTask })
    })

    it('debe llamar next si falla', async () => {
        const error = new Error('fail')
        mockCreate.mockRejectedValue(error)

        const req = { body: {}, user: { userId: 'user-1' } } as Request
        const res = mockRes()
        const next = vi.fn() as NextFunction

        await createTaskController(req, res, next)

        expect(next).toHaveBeenCalledWith(error)
    })
})

describe('getAllTasksController', () => {
    it('debe responder 200 con la lista de tareas', async () => {
        mockGetAll.mockResolvedValue([fakeTask])

        const req = { user: { userId: 'user-1' } } as Request
        const res = mockRes()
        const next = vi.fn() as NextFunction

        await getAllTasksController(req, res, next)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: [fakeTask] })
    })
})

describe('getOneTaskController', () => {
    it('debe responder 200 con la tarea encontrada', async () => {
        mockGetOne.mockResolvedValue(fakeTask)

        const req = { params: { id: 'task-1' }, user: { userId: 'user-1' } } as unknown as Request<{ id: string }>
        const res = mockRes()
        const next = vi.fn() as NextFunction

        await getOneTaskController(req, res, next)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: fakeTask })
    })
})

describe('updateTaskController', () => {
    it('debe responder 200 con la tarea actualizada', async () => {
        const updated = { ...fakeTask, titulo: 'Updated' }
        mockUpdate.mockResolvedValue(updated)

        const req = {
            params: { id: 'task-1' },
            body: { titulo: 'Updated' },
            user: { userId: 'user-1' },
        } as unknown as Request<{ id: string }>
        const res = mockRes()
        const next = vi.fn() as NextFunction

        await updateTaskController(req, res, next)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: updated })
    })
})

describe('deleteTaskController', () => {
    it('debe responder 204 sin body', async () => {
        mockRemove.mockResolvedValue(undefined)

        const req = {
            params: { id: 'task-1' },
            user: { userId: 'user-1' },
        } as unknown as Request<{ id: string }>
        const res = mockRes()
        const next = vi.fn() as NextFunction

        await deleteTaskController(req, res, next)

        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.send).toHaveBeenCalled()
    })

    it('debe llamar next si falla', async () => {
        const error = new Error('fail')
        mockRemove.mockRejectedValue(error)

        const req = {
            params: { id: 'task-1' },
            user: { userId: 'user-1' },
        } as unknown as Request<{ id: string }>
        const res = mockRes()
        const next = vi.fn() as NextFunction

        await deleteTaskController(req, res, next)

        expect(next).toHaveBeenCalledWith(error)
    })
})
