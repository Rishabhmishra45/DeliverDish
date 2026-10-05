// backend/socket.js
import { Server } from "socket.io";
import Message from "./models/message.model.js";
import Order from "./models/order.model.js";

let io;

export const initSocket = (server) => {
    const allowedOrigins = [
        "http://localhost:5173",
        process.env.FRONTEND_URL
    ];

    io = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error("Not allowed by Socket.IO CORS"));
                }
            },
            credentials: true
        }
    });

    io.on("connection", (socket) => {

        console.log(`[socket] connected: ${socket.id}`)

        socket.on("joinTrackRoom", (shopOrderId) => {
            socket.join(`track_${shopOrderId}`);
            console.log(`[socket] ${socket.id} joined room track_${shopOrderId}`)
        });

        socket.on("updateDeliveryLocation", ({ shopOrderId, latitude, longitude }) => {
            const room = io.sockets.adapter.rooms.get(`track_${shopOrderId}`)
            console.log(`[socket] location update for track_${shopOrderId} — room size: ${room ? room.size : 0}`)
            io.to(`track_${shopOrderId}`).emit("deliveryLocationUpdate", {
                latitude,
                longitude
            });
        });

        // Chat message — delivered order pe bhejna allow nahi
        socket.on("sendMessage", async ({ orderId, shopOrderId, senderId, senderRole, text }) => {
            try {
                if (!text?.trim()) return

                const order = await Order.findById(orderId)
                const shopOrder = order?.shopOrders?.id(shopOrderId)
                if (!shopOrder) return

                const isCustomer = order.user.toString() === senderId
                const isDeliveryBoy = shopOrder.deliveryBoy?.toString() === senderId
                if (!isCustomer && !isDeliveryBoy) return

                // delivered ho chuka hai — koi message accept nahi
                if (shopOrder.status === "delivered") return

                const message = await Message.create({
                    order: orderId,
                    shopOrderId,
                    sender: senderId,
                    senderRole,
                    text: text.trim()
                })

                io.to(`track_${shopOrderId}`).emit("newMessage", message)

            } catch (error) {
                console.log("[socket] sendMessage error:", error.message)
            }
        });

        socket.on("disconnect", () => {
            console.log(`[socket] disconnected: ${socket.id}`)
        });
    });

    return io;
};

export const getIo = () => io;