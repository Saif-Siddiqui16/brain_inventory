import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import { connectDB } from "./db/connectDb.js"
import authRoutes from "./routes/auth.route.js"
import groupRoutes from "./routes/group.route.js"
import expenseRoutes from "./routes/expense.route.js"

dotenv.config()

const app=express()
const PORT=process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())
app.use(cors(
{
        origin: "http://localhost:5173",
    credentials: true,
}
))

//routes
app.use("/api/auth",authRoutes)
app.use("/api/group",groupRoutes)
app.use("/api/expense",expenseRoutes)

app.listen(PORT,async()=>{
    await connectDB()
    console.log(`Server is running at ${PORT}`)
})