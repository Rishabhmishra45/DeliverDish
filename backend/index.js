import express from "express"
import dotenv from "dotenv"
dotenv.config()
import http from "http"
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/authroutes.js"
import cors from "cors"
import userRouter from "./routes/user_routes.js"
import shopRouter from "./routes/shop_routes.js"
import itemRouter from "./routes/item_routes.js"
import cartRouter from "./routes/cart_routes.js"
import orderRouter from "./routes/order_routes.js"
import locationRouter from "./routes/location_routes.js"
import reviewRouter from "./routes/review_routes.js"
import { initSocket } from "./socket.js"

const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 5000

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];

console.log("Allowed Origins:", allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    console.log("Incoming Origin:", origin);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked Origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json())
app.use(cookieParser())

// Health Check API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});


app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/shop", shopRouter)
app.use("/api/item", itemRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/location", locationRouter)
app.use("/api/review", reviewRouter)

initSocket(server)

server.listen(port, () => {
  connectDb()
  console.log(`server started at ${port}`)
})