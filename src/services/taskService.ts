import {
    createTask,
    findTasks,
    findTaskById,
    updateTask,
    deleteTask,
} from '../persistence/taskRepository'
import { NotFoundError, AuthorizationError } from '../errors/AppError'
import { CreateTaskDto, UpdateTaskDto } from '../utils/schemas'
import { Task } from '../generated/prisma/client'

/**
 * Crea una nueva tarea asociada al usuario autenticado.
 *
 * @param data   - DTO validado con los datos de la tarea.
 * @param userId - ID del usuario autenticado.
 * @returns La tarea creada.
 */
export const create = async (data: CreateTaskDto, userId: string): Promise<Task> => {
    return createTask({
        ...data,
        fechaVencimiento: data.fechaVencimiento ? new Date(data.fechaVencimiento) : undefined,
        userId,
    })
}

/**
 * Retorna todas las tareas del usuario autenticado.
 *
 * @param userId - ID del usuario autenticado.
 * @returns Lista de tareas del usuario.
 */
export const getAll = async (userId: string): Promise<Task[]> => {
    return findTasks(userId)
}

/**
 * Retorna una tarea por su ID verificando que pertenezca al usuario.
 *
 * @param taskId - ID de la tarea.
 * @param userId - ID del usuario autenticado.
 * @returns La tarea encontrada.
 * @throws {NotFoundError} Si la tarea no existe.
 * @throws {AuthorizationError} Si la tarea pertenece a otro usuario.
 */
export const getOne = async (taskId: string, userId: string): Promise<Task> => {
    const task = await findTaskById(taskId)
    if (!task) throw new NotFoundError('Tarea no encontrada')
    if (task.userId !== userId) throw new AuthorizationError()
    return task
}

/**
 * Actualiza una tarea verificando que pertenezca al usuario.
 *
 * @param taskId - ID de la tarea a actualizar.
 * @param userId - ID del usuario autenticado.
 * @param data   - Campos a actualizar.
 * @returns La tarea actualizada.
 * @throws {NotFoundError} Si la tarea no existe.
 * @throws {AuthorizationError} Si la tarea pertenece a otro usuario.
 */
export const update = async (taskId: string, userId: string, data: UpdateTaskDto): Promise<Task> => {
    const task = await findTaskById(taskId)
    if (!task) throw new NotFoundError('Tarea no encontrada')
    if (task.userId !== userId) throw new AuthorizationError()
    return updateTask(taskId, {
        ...data,
        fechaVencimiento: data.fechaVencimiento ? new Date(data.fechaVencimiento) : undefined,
    })
}

/**
 * Elimina una tarea verificando que pertenezca al usuario.
 *
 * @param taskId - ID de la tarea a eliminar.
 * @param userId - ID del usuario autenticado.
 * @throws {NotFoundError} Si la tarea no existe.
 * @throws {AuthorizationError} Si la tarea pertenece a otro usuario.
 */
export const remove = async (taskId: string, userId: string): Promise<void> => {
    const task = await findTaskById(taskId)
    if (!task) throw new NotFoundError('Tarea no encontrada')
    if (task.userId !== userId) throw new AuthorizationError()
    await deleteTask(taskId)
}