import { describe, it, expect, vi, beforeEach } from 'vitest'
import { create, getAll, getOne, update, remove } from '../services/taskService'

vi.mock('../persistence/taskRepository', () => ({
    createTask: vi.fn(),
    findTasks: vi.fn(),
    findTaskById: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
}))

import {
    createTask,
    findTasks,
    findTaskById,
    updateTask,
    deleteTask,
} from '../persistence/taskRepository'

const mockCreateTask = vi.mocked(createTask)
const mockFindTasks = vi.mocked(findTasks)
const mockFindTaskById = vi.mocked(findTaskById)
const mockUpdateTask = vi.mocked(updateTask)
const mockDeleteTask = vi.mocked(deleteTask)

const userId = 'user-1'
const otherUserId = 'user-2'

const fakeTask = {
    id: 'task-1',
    titulo: 'Estudiar TypeScript',
    descripcion: 'Generics',
    fechaVencimiento: null,
    estado: 'pendiente' as const,
    userId,
    createdAt: new Date(),
}

beforeEach(() => {
    vi.clearAllMocks()
})

describe('taskService - create', () => {
    it('debe crear una tarea correctamente', async () => {
        mockCreateTask.mockResolvedValue(fakeTask)

        const result = await create({ titulo: 'Estudiar TypeScript', descripcion: 'Generics' }, userId)

        expect(mockCreateTask).toHaveBeenCalledWith({
            titulo: 'Estudiar TypeScript',
            descripcion: 'Generics',
            fechaVencimiento: undefined,
            userId,
        })
        expect(result).toEqual(fakeTask)
    })

    it('debe convertir fechaVencimiento a Date si se proporciona', async () => {
        mockCreateTask.mockResolvedValue(fakeTask)

        await create({ titulo: 'Test', fechaVencimiento: '2025-12-31T00:00:00.000Z' }, userId)

        const arg = mockCreateTask.mock.calls[0][0]
        expect(arg.fechaVencimiento).toBeInstanceOf(Date)
    })
})

describe('taskService - getAll', () => {
    it('debe retornar las tareas del usuario', async () => {
        mockFindTasks.mockResolvedValue([fakeTask])

        const result = await getAll(userId)

        expect(mockFindTasks).toHaveBeenCalledWith(userId)
        expect(result).toEqual([fakeTask])
    })
})

describe('taskService - getOne', () => {
    it('debe retornar la tarea si pertenece al usuario', async () => {
        mockFindTaskById.mockResolvedValue(fakeTask)

        const result = await getOne('task-1', userId)

        expect(result).toEqual(fakeTask)
    })

    it('debe lanzar NotFoundError si la tarea no existe', async () => {
        mockFindTaskById.mockResolvedValue(null)

        await expect(getOne('task-1', userId)).rejects.toThrow('Tarea no encontrada')
    })

    it('debe lanzar AuthorizationError si la tarea pertenece a otro usuario', async () => {
        mockFindTaskById.mockResolvedValue(fakeTask)

        await expect(getOne('task-1', otherUserId)).rejects.toThrow(
            'No tienes permiso para realizar esta acción'
        )
    })
})

describe('taskService - update', () => {
    it('debe actualizar la tarea si pertenece al usuario', async () => {
        const updated = { ...fakeTask, titulo: 'Actualizado' }
        mockFindTaskById.mockResolvedValue(fakeTask)
        mockUpdateTask.mockResolvedValue(updated)

        const result = await update('task-1', userId, { titulo: 'Actualizado' })

        expect(mockUpdateTask).toHaveBeenCalledWith('task-1', {
            titulo: 'Actualizado',
            fechaVencimiento: undefined,
        })
        expect(result.titulo).toBe('Actualizado')
    })

    it('debe lanzar NotFoundError si la tarea no existe', async () => {
        mockFindTaskById.mockResolvedValue(null)

        await expect(update('task-1', userId, { titulo: 'X' })).rejects.toThrow('Tarea no encontrada')
    })

    it('debe lanzar AuthorizationError si la tarea no es del usuario', async () => {
        mockFindTaskById.mockResolvedValue(fakeTask)

        await expect(update('task-1', otherUserId, { titulo: 'X' })).rejects.toThrow(
            'No tienes permiso para realizar esta acción'
        )
    })
})

describe('taskService - remove', () => {
    it('debe eliminar la tarea si pertenece al usuario', async () => {
        mockFindTaskById.mockResolvedValue(fakeTask)
        mockDeleteTask.mockResolvedValue(fakeTask)

        await expect(remove('task-1', userId)).resolves.toBeUndefined()
        expect(mockDeleteTask).toHaveBeenCalledWith('task-1')
    })

    it('debe lanzar NotFoundError si la tarea no existe', async () => {
        mockFindTaskById.mockResolvedValue(null)

        await expect(remove('task-1', userId)).rejects.toThrow('Tarea no encontrada')
    })

    it('debe lanzar AuthorizationError si la tarea no es del usuario', async () => {
        mockFindTaskById.mockResolvedValue(fakeTask)

        await expect(remove('task-1', otherUserId)).rejects.toThrow(
            'No tienes permiso para realizar esta acción'
        )
    })
})
