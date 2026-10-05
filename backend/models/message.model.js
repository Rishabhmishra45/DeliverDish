// backend/models/message.model.js
import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    shopOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    senderRole: {
        type: String,
        enum: ["user", "deliveryBoy"],
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    }
}, { timestamps: true })

messageSchema.index({ shopOrderId: 1, createdAt: 1 })

const Message = mongoose.model("Message", messageSchema)
export default Message