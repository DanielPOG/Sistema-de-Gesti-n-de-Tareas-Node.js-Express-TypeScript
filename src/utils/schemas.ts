import { z } from 'zod';

export const registerSchema = z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('El email no tiene un formato válido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const loginSchema = z.object({
    email: z.string().email('El email no tiene un formato válido'),
    password: z.string().min(1, 'La contraseña es requerida'),
});

export const createTaskSchema = z.object({
    titulo: z.string().min(1, 'El título es requerido'),
    descripcion: z.string().optional(),
    fechaVencimiento: z.string().datetime().optional(),
});

export const updateTaskSchema = z.object({
    titulo: z.string().min(1).optional(),
    descripcion: z.string().optional(),
    fechaVencimiento: z.string().datetime().optional(),
    estado: z.enum(['pendiente', 'en_curso', 'completada']).optional(),
});

// tipos inferidos 
export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;