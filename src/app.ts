import express, { Express, Request, Response } from "express"
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import path from 'path'
import { errorHandler } from "./api/middlewares/errorHandler"
import authRoutes from './api/routes/authRoutes'
import taskRoutes from './api/routes/taskRoutes'
const swaggerDocument = YAML.load(path.join(__dirname, './docs/swagger.yaml'));

const app: Express = express()
app.use(express.json())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/ping", (_req: Request, res: Response) => {
    res.json({ status: "ok" })
})

app.use("/auth", authRoutes)
app.use('/tasks', taskRoutes)

//Middleware Global para manejo de errores
app.use(errorHandler)

export default app