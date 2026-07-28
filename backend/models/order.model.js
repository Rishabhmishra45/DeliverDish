import mongoose from "mongoose"
 
const shopOrderItemSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})
 
const shopOrderSchema = new mongoose.Schema({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    city: {
        type: String,
        required: true
    },
    items: [shopOrderItemSchema],
    subtotal: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "preparing", "out for delivery", "delivered", "cancelled"],
        default: "pending"
    },
    deliveryBoy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    deliveryBoyStatus: {
        type: String,
        enum: ["notAssigned", "broadcasted", "assigned", "delivered"],
        default: "notAssigned"
    },
    deliveredAt: {
        type: Date,
        default: null
    },
    tip: {
        type: Number,
        default: 0
    }
})
 
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    shopOrders: [shopOrderSchema],
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
    }
}, { timestamps: true })
 
const Order = mongoose.model("Order", orderSchema)
export default Order