import app from "./app"
import {config} from "./config/env"
const startServer = async () => {
    try {
        app.listen(config.port, () => {
            console.log(`Servidor corriendo en puerto ${config.port}`)
        })
    } catch (error) {
        // Para asegurar que sea de la clase error
        if (error instanceof Error) {
            console.error(`Detalle: ${error.message}`)
        }
        process.exit(1)
    }
}

startServer()