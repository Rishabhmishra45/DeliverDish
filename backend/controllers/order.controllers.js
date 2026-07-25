import crypto from "crypto"
import Order from "../models/order.model.js"
import User from "../models/user.model.js"
import Shop from "../models/shop.model.js"
import razorpayInstance from "../utils/razorpay.js"
import { getDistanceKm } from "../utils/distance.js"

const DELIVERY_FEE = 40
const MAX_RADIUS_KM = 10

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
                city: shop.city,
                items,
                subtotal: shopSubtotal,
                status: "pending",
                deliveryBoy: null,
                deliveryBoyStatus: "notAssigned"
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
            .populate("shopOrders.deliveryBoy", "fullName mobile location")
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
            .populate("shopOrders.deliveryBoy", "fullName mobile")
            .sort({ createdAt: -1 })

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

        if (shopOrder.status === "out for delivery") {
            return res.status(400).json({ message: "delivery status is now managed by the delivery partner" })
        }

        shopOrder.status = status

        if (status === "out for delivery") {
            shopOrder.deliveryBoyStatus = "broadcasted"
        }

        await order.save()

        return res.status(200).json({ message: "status updated", order })
    } catch (error) {
        return res.status(500).json({ message: `update order status error ${error}` })
    }
}


export const getAvailableDeliveryBoys = async (req, res) => {
    try {
        const { orderId, shopOrderId } = req.params

        const order = await Order.findById(orderId).populate("shopOrders.shop")
        if (!order) {
            return res.status(400).json({ message: "order not found" })
        }

        const shopOrder = order.shopOrders.id(shopOrderId)
        if (!shopOrder) {
            return res.status(400).json({ message: "shop order not found" })
        }

        if (shopOrder.owner.toString() !== req.userId) {
            return res.status(403).json({ message: "not authorized for this order" })
        }

        const shop = shopOrder.shop

        if (shopOrder.deliveryBoy) {
            return res.status(200).json({ assigned: true, deliveryBoys: [] })
        }

        if (!shop?.latitude || !shop?.longitude) {
            return res.status(200).json({ assigned: false, deliveryBoys: [], message: "shop location not set" })
        }

        const candidates = await User.find({
            role: "deliveryBoy",
            "location.latitude": { $exists: true, $ne: null },
            "location.longitude": { $exists: true, $ne: null }
        }).select("fullName mobile location")

        const nearby = candidates
            .map((boy) => ({
                _id: boy._id,
                fullName: boy.fullName,
                mobile: boy.mobile,
                distance: getDistanceKm(
                    shop.latitude, shop.longitude,
                    boy.location.latitude, boy.location.longitude
                )
            }))
            .filter((boy) => boy.distance <= MAX_RADIUS_KM)
            .sort((a, b) => a.distance - b.distance)

        return res.status(200).json({ assigned: false, deliveryBoys: nearby })
    } catch (error) {
        return res.status(500).json({ message: `get available delivery boys error ${error}` })
    }
}


export const getDeliveryOrders = async (req, res) => {
    try {
        const deliveryBoy = await User.findById(req.userId)
        if (!deliveryBoy?.location?.latitude || !deliveryBoy?.location?.longitude) {
            return res.status(400).json({ message: "delivery boy location not set" })
        }

        const orders = await Order.find({
            shopOrders: {
                $elemMatch: {
                    status: "out for delivery",
                    deliveryBoy: null
                }
            }
        })
            .populate("user", "fullName mobile")
            .populate("shopOrders.shop")
            .populate("shopOrders.items.item")
            .sort({ createdAt: -1 })

        const availableOrders = []

        for (const order of orders) {
            for (const shopOrder of order.shopOrders) {

                if (shopOrder.status !== "out for delivery" || shopOrder.deliveryBoy) continue

                const shopLat = shopOrder.shop?.latitude
                const shopLon = shopOrder.shop?.longitude

                if (!shopLat || !shopLon) continue

                const distance = getDistanceKm(
                    deliveryBoy.location.latitude, deliveryBoy.location.longitude,
                    shopLat, shopLon
                )

                if (distance > MAX_RADIUS_KM) continue

                availableOrders.push({
                    _id: order._id,
                    user: order.user,
                    deliveryAddress: order.deliveryAddress,
                    paymentMethod: order.paymentMethod,
                    createdAt: order.createdAt,
                    shopOrder,
                    distance
                })
            }
        }

        availableOrders.sort((a, b) => a.distance - b.distance)

        return res.status(200).json(availableOrders)
    } catch (error) {
        return res.status(500).json({ message: `get delivery orders error ${error}` })
    }
}


export const getMyDeliveries = async (req, res) => {
    try {
        const orders = await Order.find({ "shopOrders.deliveryBoy": req.userId })
            .populate("user", "fullName mobile")
            .populate("shopOrders.shop")
            .populate("shopOrders.items.item")
            .sort({ createdAt: -1 })

        const myDeliveries = []

        for (const order of orders) {
            const shopOrder = order.shopOrders.find(
                (so) => so.deliveryBoy?.toString() === req.userId
            )

            if (shopOrder) {
                myDeliveries.push({
                    _id: order._id,
                    user: order.user,
                    deliveryAddress: order.deliveryAddress,
                    paymentMethod: order.paymentMethod,
                    createdAt: order.createdAt,
                    shopOrder
                })
            }
        }

        return res.status(200).json(myDeliveries)
    } catch (error) {
        return res.status(500).json({ message: `get my deliveries error ${error}` })
    }
}


export const acceptOrder = async (req, res) => {
    try {
        const { orderId, shopOrderId } = req.params

        const order = await Order.findOneAndUpdate(
            {
                _id: orderId,
                "shopOrders._id": shopOrderId,
                "shopOrders.deliveryBoy": null
            },
            {
                $set: {
                    "shopOrders.$.deliveryBoy": req.userId,
                    "shopOrders.$.deliveryBoyStatus": "assigned"
                }
            },
            { new: true }
        )

        if (!order) {
            return res.status(409).json({ message: "This order has already been accepted by another delivery partner" })
        }

        return res.status(200).json({ message: "order accepted", order })
    } catch (error) {
        return res.status(500).json({ message: `accept order error ${error}` })
    }
}


export const markDelivered = async (req, res) => {
    try {
        const { orderId, shopOrderId } = req.params

        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(400).json({ message: "order not found" })
        }

        const shopOrder = order.shopOrders.id(shopOrderId)
        if (!shopOrder) {
            return res.status(400).json({ message: "shop order not found" })
        }

        if (shopOrder.deliveryBoy?.toString() !== req.userId) {
            return res.status(403).json({ message: "not authorized for this order" })
        }

        shopOrder.status = "delivered"
        shopOrder.deliveryBoyStatus = "delivered"

        if (order.paymentMethod === "cod") {
            order.paymentStatus = "paid"
        }

        await order.save()

        return res.status(200).json({ message: "marked as delivered", order })
    } catch (error) {
        return res.status(500).json({ message: `mark delivered error ${error}` })
    }
}


// user ke liye: shop info, items, delivery boy details, aur delivery address — Track Order page ke liye
export const trackOrder = async (req, res) => {
    try {
        const { orderId, shopOrderId } = req.params

        const order = await Order.findById(orderId)
            .populate("shopOrders.shop")
            .populate("shopOrders.items.item")
            .populate("shopOrders.deliveryBoy", "fullName mobile location")

        if (!order) {
            return res.status(400).json({ message: "order not found" })
        }

        if (order.user.toString() !== req.userId) {
            return res.status(403).json({ message: "not authorized for this order" })
        }

        const shopOrder = order.shopOrders.id(shopOrderId)
        if (!shopOrder) {
            return res.status(400).json({ message: "shop order not found" })
        }

        if (!shopOrder.deliveryBoy) {
            return res.status(400).json({ message: "delivery boy not assigned yet" })
        }

        return res.status(200).json({
            shop: shopOrder.shop,
            items: shopOrder.items,
            subtotal: shopOrder.subtotal,
            status: shopOrder.status,
            deliveryBoy: {
                fullName: shopOrder.deliveryBoy.fullName,
                mobile: shopOrder.deliveryBoy.mobile,
                location: shopOrder.deliveryBoy.location
            },
            deliveryAddress: order.deliveryAddress
        })

    } catch (error) {
        return res.status(500).json({ message: `track order error ${error}` })
    }
}