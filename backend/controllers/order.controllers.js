import crypto from "crypto"
import Order from "../models/order.model.js"
import User from "../models/user.model.js"
import Shop from "../models/shop.model.js"
import razorpayInstance from "../utils/razorpay.js"

const DELIVERY_FEE = 40

export const placeOrder = async (req, res) => {
    try {
        const { paymentMethod, deliveryAddress } = req.body

        if (!deliveryAddress?.text) {
            return res.status(400).json({ message: "delivery address is required" })
        }

        const user = await User.findById(req.userId).populate("cart.item")
        if (!user || !user.cart || user.cart.length === 0) {
            return res.status(400).json({ message: "cart is empty" })
        }

        // cart ke items ko unke shop ke hisaab se group kiya
        const groupedByShop = {}

        for (const c of user.cart) {
            const shopId = c.item.shop.toString()

            if (!groupedByShop[shopId]) {
                groupedByShop[shopId] = []
            }

            groupedByShop[shopId].push({
                item: c.item._id,
                quantity: c.quantity,
                price: c.item.price
            })
        }

        const shopIds = Object.keys(groupedByShop)
        const shops = await Shop.find({ _id: { $in: shopIds } })

        const shopOrders = shops.map((shop) => {
            const items = groupedByShop[shop._id.toString()]
            const shopSubtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

            return {
                shop: shop._id,
                owner: shop.owner,
                items,
                subtotal: shopSubtotal,
                status: "pending"
            }
        })

        const subtotal = shopOrders.reduce((sum, s) => sum + s.subtotal, 0)
        const totalAmount = subtotal + DELIVERY_FEE

        if (paymentMethod === "cod") {

            const order = await Order.create({
                user: req.userId,
                shopOrders,
                subtotal,
                deliveryFee: DELIVERY_FEE,
                totalAmount,
                deliveryAddress,
                paymentMethod: "cod",
                paymentStatus: "pending"
            })

            user.cart = []
            await user.save()

            return res.status(201).json({ order })

        } else if (paymentMethod === "online") {

            const razorpayOrder = await razorpayInstance.orders.create({
                amount: Math.round(totalAmount * 100),
                currency: "INR",
                receipt: `receipt_${Date.now()}`
            })

            const order = await Order.create({
                user: req.userId,
                shopOrders,
                subtotal,
                deliveryFee: DELIVERY_FEE,
                totalAmount,
                deliveryAddress,
                paymentMethod: "online",
                paymentStatus: "pending",
                razorpayOrderId: razorpayOrder.id
            })

            return res.status(201).json({
                order,
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                key: process.env.RAZORPAY_KEY_ID
            })

        } else {
            return res.status(400).json({ message: "invalid payment method" })
        }

    } catch (error) {
        return res.status(500).json({ message: `place order error ${error}` })
    }
}


export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

        const sign = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex")

        if (expectedSign !== razorpay_signature) {
            return res.status(400).json({ message: "payment verification failed" })
        }

        const order = await Order.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            { paymentStatus: "paid", razorpayPaymentId: razorpay_payment_id },
            { new: true }
        )

        if (!order) {
            return res.status(400).json({ message: "order not found" })
        }

        const user = await User.findById(req.userId)
        user.cart = []
        await user.save()

        return res.status(200).json({ message: "payment verified", order })

    } catch (error) {
        return res.status(500).json({ message: `verify payment error ${error}` })
    }
}


export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId })
            .populate("shopOrders.shop")
            .populate("shopOrders.items.item")
            .sort({ createdAt: -1 })

        return res.status(200).json(orders)
    } catch (error) {
        return res.status(500).json({ message: `get my orders error ${error}` })
    }
}


export const getOwnerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ "shopOrders.owner": req.userId })
            .populate("user", "fullName mobile")
            .populate("shopOrders.shop")
            .populate("shopOrders.items.item")
            .sort({ createdAt: -1 })

        // sirf apne shop wala hissa hi return karo, doosri shops ka data chhupa diya
        const myOrders = orders.map((order) => {
            const myShopOrder = order.shopOrders.find(
                (so) => so.owner.toString() === req.userId
            )

            return {
                _id: order._id,
                user: order.user,
                deliveryAddress: order.deliveryAddress,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt,
                shopOrder: myShopOrder
            }
        })

        return res.status(200).json(myOrders)
    } catch (error) {
        return res.status(500).json({ message: `get owner orders error ${error}` })
    }
}


export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params
        const { status } = req.body

        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(400).json({ message: "order not found" })
        }

        const shopOrder = order.shopOrders.find(
            (so) => so.owner.toString() === req.userId
        )

        if (!shopOrder) {
            return res.status(403).json({ message: "not authorized for this order" })
        }

        shopOrder.status = status
        await order.save()

        return res.status(200).json({ message: "status updated", order })
    } catch (error) {
        return res.status(500).json({ message: `update order status error ${error}` })
    }
}