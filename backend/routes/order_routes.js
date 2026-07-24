import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { placeOrder, verifyPayment } from "../controllers/order.controllers.js"

const orderRouter = express.Router()

orderRouter.post("/place-order", isAuth, placeOrder)
orderRouter.post("/verify-payment", isAuth, verifyPayment)

export default orderRouter