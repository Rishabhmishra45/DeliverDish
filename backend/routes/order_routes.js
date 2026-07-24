import express from "express"
import isAuth from "../middlewares/isAuth.js"
import {
    placeOrder,
    verifyPayment,
    getMyOrders,
    getOwnerOrders,
    updateOrderStatus
} from "../controllers/order.controllers.js"

const orderRouter = express.Router()

orderRouter.post("/place-order", isAuth, placeOrder)
orderRouter.post("/verify-payment", isAuth, verifyPayment)
orderRouter.get("/my-orders", isAuth, getMyOrders)
orderRouter.get("/owner-orders", isAuth, getOwnerOrders)
orderRouter.post("/update-status/:orderId", isAuth, updateOrderStatus)

export default orderRouter