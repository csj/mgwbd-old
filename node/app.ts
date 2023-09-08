import express, {json} from "express";
import {RegisterRoutes} from "./build/routes";
import cors from 'cors'

const app = express()
app.use(json())
app.use(cors({origin: true, credentials: true}))

app.listen(5000, () => console.log("Server running on port 5000"))

RegisterRoutes(app)
