import prisma from './prisma'
import { User } from '../generated/prisma/client'

/**
 * Datos necesarios para crear un nuevo usuario.
 */
interface CreateUserData {
    nombre: string
    email: string
    password: string
}

/**
 * Crea un nuevo usuario en la base de datos.
 *
 * @param data - Datos del usuario a registrar.
 * @returns El usuario creado.
 */
export const createUser = async (data: CreateUserData): Promise<User> => {
    return prisma.user.create({ data })
}

/**
 * Busca un usuario por su dirección de email.
 *
 * @param email - Email único del usuario.
 * @returns El usuario encontrado o `null` si no existe.
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
    return prisma.user.findUnique({ where: { email } })
}

/**
 * Busca un usuario por su ID.
 *
 * @param id - ID único del usuario.
 * @returns El usuario encontrado o `null` si no existe.
 */
export const findUserById = async (id: string): Promise<User | null> => {
    return prisma.user.findUnique({ where: { id } })
}