import express from 'express';
import cookieParser from "cookie-parser"
import cors from "cors"

// all custom import
import userRoutes from "./routes/user.routes.js"

const app = express();

app.use(
    cors({
        origin: process.env.BASE_URL,
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"]
    })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser())


app.use("/api/v1/user", userRoutes)

export { app };
