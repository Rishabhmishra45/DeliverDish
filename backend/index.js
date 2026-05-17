import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
dotenv.config()
const app = express()
const port = process.env.PORT || 5000

app.listen(port,()=>{
    connectDb()
    console.log(`server started at ${port}`)
})