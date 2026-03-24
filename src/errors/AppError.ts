/**
 * Clase base para errores operacionales de la aplicación.
 *
 * Extiende `Error` con un `statusCode` HTTP y corrige la cadena de
 * prototipado que TypeScript rompe al extender clases built-in.
 *
 * @example
 * throw new AppError('Algo salió mal', 500)
 */
export class AppError extends Error {
    /** Código de estado HTTP asociado al error. */
    public readonly statusCode: number

    /**
     * @param message   - Mensaje descriptivo del error.
     * @param statusCode - Código de estado HTTP (ej. 400, 404, 500).
     */
    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
        // Necesario para que `instanceof` funcione correctamente al extender
        // clases built-in en TypeScript compilado a ES5/CommonJS.
        Object.setPrototypeOf(this, new.target.prototype)
        // Asocia el nombre real de la subclase al stack trace del error.
        this.name = this.constructor.name
    }
}

/**
 * Error 404 – el recurso solicitado no existe.
 *
 * Usado en los repositorios cuando `findUserById`, `findTaskById`
 * o cualquier búsqueda retorna `null`.
 *
 * @example
 * throw new NotFoundError('Usuario no encontrado')
 */
export class NotFoundError extends AppError {
    constructor(message = 'Recurso no encontrado') {
        super(message, 404)
    }
}

/**
 * Error 401 – el usuario no está autenticado.
 *
 * Se lanza cuando falta o es inválido el token de sesión.
 *
 * @example
 * throw new AuthenticationError()
 */
export class AuthenticationError extends AppError {
    constructor(message = 'No autenticado') {
        super(message, 401)
    }
}

/**
 * Error 403 – el usuario está autenticado pero no tiene permisos.
 *
 * Usado cuando un usuario intenta acceder a una tarea
 * que pertenece a otro usuario.
 *
 * @example
 * throw new AuthorizationError('No puedes modificar esta tarea')
 */
export class AuthorizationError extends AppError {
    constructor(message = 'No tienes permiso para realizar esta acción') {
        super(message, 403)
    }
}

/**
 * Error 400 – los datos de entrada no son válidos.
 *
 * Usado cuando el cuerpo de una petición no supera la validación
 * antes de llegar al repositorio.
 *
 * @example
 * throw new ValidationError('El email no tiene un formato válido')
 */
export class ValidationError extends AppError {
    constructor(message = 'Datos inválidos') {
        super(message, 400)
    }
}

/**
 * Error 409 – conflicto con el estado actual del recurso.
 *
 * Usado en `createUser` cuando el email ya está registrado
 * (violación de restricción `@unique`).
 *
 * @example
 * throw new ConflictError('El email ya está en uso')
 */
export class ConflictError extends AppError {
    constructor(message = 'El recurso ya existe') {
        super(message, 409)
    }
}