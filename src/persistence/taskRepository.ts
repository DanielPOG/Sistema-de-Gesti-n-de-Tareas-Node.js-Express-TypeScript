import prisma from './prisma'
import { Task, TaskStatus } from '../generated/prisma/client'

/**
 * Datos necesarios para crear una nueva tarea.
 */
interface CreateTaskData {
    titulo: string
    descripcion?: string
    fechaVencimiento?: Date
    userId: string
}

/**
 * Datos actualizables de una tarea existente.
 */
interface UpdateTaskData {
    titulo?: string
    descripcion?: string
    fechaVencimiento?: Date
    estado?: TaskStatus
}

/**
 * Crea una nueva tarea asociada a un usuario.
 *
 * @param data - Datos de la tarea a crear.
 * @returns La tarea creada.
 */
export const createTask = async (data: CreateTaskData): Promise<Task> => {
    return prisma.task.create({ data })
}

/**
 * Obtiene todas las tareas pertenecientes a un usuario.
 *
 * @param userId - ID del usuario propietario de las tareas.
 * @returns Lista de tareas del usuario.
 */
export const findTasks = async (userId: string): Promise<Task[]> => {
    return prisma.task.findMany({ where: { userId } })
}

/**
 * Busca una tarea por su ID.
 *
 * @param id - ID único de la tarea.
 * @returns La tarea encontrada o `null` si no existe.
 */
export const findTaskById = async (id: string): Promise<Task | null> => {
    return prisma.task.findUnique({ where: { id } })
}

/**
 * Actualiza los campos de una tarea existente.
 *
 * @param id - ID de la tarea a actualizar.
 * @param data - Campos a actualizar (todos opcionales).
 * @returns La tarea actualizada.
 */
export const updateTask = async (id: string, data: UpdateTaskData): Promise<Task> => {
    return prisma.task.update({ where: { id }, data })
}

/**
 * Elimina una tarea por su ID.
 *
 * @param id - ID de la tarea a eliminar.
 * @returns La tarea eliminada.
 */
export const deleteTask = async (id: string): Promise<Task> => {
    return prisma.task.delete({ where: { id } })
}