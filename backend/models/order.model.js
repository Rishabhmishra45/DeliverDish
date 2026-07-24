import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item"
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop"
        }
    }],
    subtotal: {
        type: Number,
        required: true
    },
    deliveryFee: {
        type: Number,
        default: 40
    },
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        text: {
            type: String,
            required: true
        },
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        }
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "online"],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    razorpayOrderId: {
        type: String
    },
    razorpayPaymentId: {
        type: String
    },
    orderStatus: {
        type: String,
        enum: ["pending", "preparing", "out for delivery", "delivered", "cancelled"],
        default: "pending"
    }
}, { timestamps: true })

const Order = mongoose.model("Order", orderSchema)
export default Order