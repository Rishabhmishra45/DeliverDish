// backend/routes/message_routes.js
import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { getMessages } from "../controllers/message.controllers.js"

const router = express.Router()
router.get("/:orderId/:shopOrderId", isAuth, getMessages)

export default router