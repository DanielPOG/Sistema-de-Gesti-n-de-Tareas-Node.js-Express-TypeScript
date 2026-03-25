import express, { Express, Request, Response } from "express"
import { errorHandler } from "./api/middlewares/errorHandler"
import authRoutes from './api/routes/authRoutes'
import taskRoutes from './api/routes/taskRoutes'
const app: Express = express()
app.use(express.json())

app.get("/ping", (_req: Request, res: Response) => {
    res.json({ status: "ok" })
})

app.use("/auth", authRoutes)
app.use('/tasks', taskRoutes)

//Middleware Global para manejo de errores
app.use(errorHandler)

export default app