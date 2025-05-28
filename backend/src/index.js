import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import { connectDB } from "./db/connectDb.js"

dotenv.config()

const app=express()
const PORT=process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.listen(PORT,async()=>{
    await connectDB()
    console.log(`Server is running at ${PORT}`)
})