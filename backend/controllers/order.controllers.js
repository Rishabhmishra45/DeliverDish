import crypto from "crypto"
import Order from "../models/order.model.js"
import User from "../models/user.model.js"
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

        const orderItems = user.cart.map((c) => ({
            item: c.item._id,
            quantity: c.quantity,
            price: c.item.price,
            shop: c.item.shop
        }))

        const subtotal = orderItems.reduce(
            (sum, i) => sum + i.price * i.quantity, 0
        )

        const totalAmount = subtotal + DELIVERY_FEE

        if (paymentMethod === "cod") {

            const order = await Order.create({
                user: req.userId,
                items: orderItems,
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
                items: orderItems,
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