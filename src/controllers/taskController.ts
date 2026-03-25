import { Request, Response, NextFunction } from 'express'
import { create, getAll, getOne, update, remove } from '../services/taskService'
import { CreateTaskDto, UpdateTaskDto } from '../utils/schemas'

/**
 * POST /tasks
 */
export const createTaskController = async (
    req: Request<{}, {}, CreateTaskDto>,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const task = await create(req.body, req.user!.userId)
        res.status(201).json({ status: 'success', data: task })
    } catch (error) {
        next(error)
    }
}

/**
 * GET /tasks
 */
export const getAllTasksController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const tasks = await getAll(req.user!.userId)
        res.status(200).json({ status: 'success', data: tasks })
    } catch (error) {
        next(error)
    }
}

/**
 * GET /tasks/:id
 */
export const getOneTaskController = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const task = await getOne(req.params.id, req.user!.userId)
        res.status(200).json({ status: 'success', data: task })
    } catch (error) {
        next(error)
    }
}

/**
 * PUT /tasks/:id
 */
export const updateTaskController = async (
    req: Request<{ id: string }, {}, UpdateTaskDto>,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const task = await update(req.params.id, req.user!.userId, req.body)
        res.status(200).json({ status: 'success', data: task })
    } catch (error) {
        next(error)
    }
}

/**
 * DELETE /tasks/:id
 */
export const deleteTaskController = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        await remove(req.params.id, req.user!.userId)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}