import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { findUserByEmail, createUser } from '../persistence/userRepository'
import { AuthenticationError, ConflictError } from '../errors/AppError'
import { config } from '../config/env'
import { RegisterDto, LoginDto } from '../utils/schemas'

/**
 * Registrar user hasheando contraseña
 * Lanza ConflictError si el email ya está registrado.
 */

export const register = async (data: RegisterDto): Promise<{ id: string; email: string; nombre: string }> => {
    const existing = await findUserByEmail(data.email)
    if (existing) throw new ConflictError("El email ya esta")
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const user = await createUser({
        nombre: data.nombre,
        email: data.email,
        password: hashedPassword,
    })
    return { id: user.id, email: user.email, nombre: user.nombre }
}

/**
 * Verifica las credenciales del usuario y retorna un JWT si son correctas.
 * Lanza AuthenticationError si el email o contraseña son incorrectos.
 */

export const login = async (data: LoginDto): Promise<{ token: string }> => {
    const user = await findUserByEmail(data.email)
    if (!user) throw new AuthenticationError('Credenciales inválidas')

    const passwordMatch = await bcrypt.compare(data.password, user.password)
    if (!passwordMatch) throw new AuthenticationError('Credenciales inválidas')

    const token = jwt.sign(
        { userId: user.id },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
    )
    return { token }
}