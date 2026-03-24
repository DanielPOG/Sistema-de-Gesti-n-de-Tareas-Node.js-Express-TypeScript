import { Request, Response, NextFunction } from 'express'
import { AppError } from '../../errors/AppError'

/**
 * Middleware global de manejo de errores para Express.
 *
 * Captura todos los errores propagados con `next(err)` y devuelve
 * una respuesta JSON consistente. Debe registrarse **después de todas
 * las rutas** en `app.ts` para funcionar correctamente.
 *
 * - Si el error es una instancia de {@link AppError}, usa su `statusCode`
 *   y `message` directamente.
 * - Cualquier otro error inesperado responde con 500 sin exponer detalles
 *   internos al cliente.
 *
 * @param err   - El error capturado.
 * @param _req  - Objeto de solicitud HTTP (no utilizado).
 * @param res   - Objeto de respuesta HTTP.
 * @param _next - Función next (requerida por Express para reconocer el middleware como manejador de errores).
 */
export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: 'error',
            name: err.name,
            message: err.message,
        })
        return
    }

    // Error no controlado: loguear internamente pero no exponer detalles al cliente
    console.error(`[${new Date().toISOString()}] Error inesperado:`, err)
    res.status(500).json({
        status: 'error',
        name: 'InternalServerError',
        message: 'Error interno del servidor',
    })
}