import express from "express"
import isAuth from "../middlewares/isAuth.js"
import {
    placeOrder,
    verifyPayment,
    getMyOrders,
    getOwnerOrders,
    updateOrderStatus,
    getAvailableDeliveryBoys,
    getDeliveryOrders,
    getMyDeliveries,
    acceptOrder,
    markDelivered,
    trackOrder,
    addTip,
    getMyEarnings
} from "../controllers/order.controllers.js"

const orderRouter = express.Router()

orderRouter.post("/place-order", isAuth, placeOrder)
orderRouter.post("/verify-payment", isAuth, verifyPayment)
orderRouter.get("/my-orders", isAuth, getMyOrders)
orderRouter.get("/owner-orders", isAuth, getOwnerOrders)
orderRouter.post("/update-status/:orderId", isAuth, updateOrderStatus)
orderRouter.get("/available-delivery-boys/:orderId/:shopOrderId", isAuth, getAvailableDeliveryBoys)
orderRouter.get("/delivery-orders", isAuth, getDeliveryOrders)
orderRouter.get("/my-deliveries", isAuth, getMyDeliveries)
orderRouter.post("/accept-order/:orderId/:shopOrderId", isAuth, acceptOrder)
orderRouter.post("/mark-delivered/:orderId/:shopOrderId", isAuth, markDelivered)
orderRouter.get("/track-order/:orderId/:shopOrderId", isAuth, trackOrder)
orderRouter.post("/add-tip/:orderId/:shopOrderId", isAuth, addTip)
orderRouter.get("/my-earnings", isAuth, getMyEarnings)

export default orderRouter