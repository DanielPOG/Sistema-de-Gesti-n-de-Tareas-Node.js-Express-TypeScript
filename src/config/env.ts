import dotenv from "dotenv";

dotenv.config();

/**
 * Singleton que centraliza y valida todas las variables de entorno de la aplicación.
 *
 * @remarks
 * Se inicializa una única vez al arrancar la aplicación. Si alguna variable
 * requerida no está definida, lanza un error para detener el inicio de forma
 * segura.
 *
 * @example
 * ```ts
 * import { config } from "./config/env";
 *
 * console.log(config.port);        // 3000
 * console.log(config.databaseUrl); // "postgresql://..."
 * ```
 */
class Config {
    private static instance: Config;

    /** Puerto en el que escucha el servidor HTTP. Por defecto `3000`. */
    public readonly port: number;

    /** URL de conexión a la base de datos (requerida). */
    public readonly databaseUrl: string;

    /** Clave secreta utilizada para firmar los tokens JWT (requerida). */
    public readonly jwtSecret: string;

    /** Tiempo de expiración de los tokens JWT. Por defecto `'7d'`. */
    public readonly jwtExpiresIn: string;

    private constructor() {
        this.port = parseInt(process.env.PORT ?? "3000", 10);
        this.databaseUrl = this.require("DATABASE_URL");
        this.jwtSecret = this.require("JWT_SECRET");
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? "7d";
    }

    /**
     * Obtiene el valor de una variable de entorno requerida.
     *
     * @param key - Nombre de la variable de entorno.
     * @returns El valor de la variable de entorno.
     * @throws {Error} Si la variable no está definida o está vacía.
     */
    private require(key: string): string {
        const value = process.env[key];
        if (!value) {
            throw new Error(`Variable de entorno requerida no encontrada: ${key}`);
        }
        return value;
    }

    /**
     * Devuelve la instancia única de `Config`, creándola si aún no existe.
     *
     * @returns La instancia singleton de `Config`.
     */
    public static getInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }
}

/** Instancia singleton de configuración lista para importar en cualquier módulo. */
export const config = Config.getInstance();

