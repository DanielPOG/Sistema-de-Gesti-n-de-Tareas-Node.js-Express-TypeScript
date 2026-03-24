import express, { Express, Request, Response } from "express"

const app: Express = express()
app.use(express.json()) 

app.get("/ping", (_req: Request, res: Response) => {
    res.json({ status: "ok" })
})

export default app