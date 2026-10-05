// backend/controllers/message.controllers.js
import Message from "../models/message.model.js"
import Order from "../models/order.model.js"

const getAuthorizedShopOrder = async (req) => {
    const { orderId, shopOrderId } = req.params

    const order = await Order.findById(orderId)
    if (!order) return { error: "order not found", code: 400 }

    const shopOrder = order.shopOrders.id(shopOrderId)
    if (!shopOrder) return { error: "shop order not found", code: 400 }

    const isCustomer = order.user.toString() === req.userId
    const isDeliveryBoy = shopOrder.deliveryBoy?.toString() === req.userId

    if (!isCustomer && !isDeliveryBoy) {
        return { error: "not authorized for this chat", code: 403 }
    }

    return { order, shopOrder }
}

export const getMessages = async (req, res) => {
    try {
        const { shopOrderId } = req.params

        const result = await getAuthorizedShopOrder(req)
        if (result.error) {
            return res.status(result.code).json({ message: result.error })
        }

        // delivered ho chuka order — koi bhi purana message read nahi kar sakta
        if (result.shopOrder.status === "delivered") {
            return res.status(403).json({ message: "chat is closed for this order" })
        }

        const messages = await Message.find({ shopOrderId }).sort({ createdAt: 1 })
        return res.status(200).json(messages)

    } catch (error) {
        return res.status(500).json({ message: `get messages error ${error}` })
    }
}