import express, { Express, Request, Response } from "express"
import { errorHandler } from "./api/middlewares/errorHandler"

const app: Express = express()
app.use(express.json())

app.get("/ping", (_req: Request, res: Response) => {
    res.json({ status: "ok" })
})

//Middleware Global para manejo de errores
app.use(errorHandler)

export default app