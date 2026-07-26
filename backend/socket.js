import { Server } from "socket.io";

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

        // User apne order ke tracking room me join karta hai
        socket.on("joinTrackRoom", (shopOrderId) => {
            socket.join(`track_${shopOrderId}`);
            console.log(`[socket] ${socket.id} joined room track_${shopOrderId}`)
        });

        // Delivery boy apni current location broadcast karta hai
        socket.on("updateDeliveryLocation", ({ shopOrderId, latitude, longitude }) => {
            const room = io.sockets.adapter.rooms.get(`track_${shopOrderId}`)
            console.log(`[socket] location update for track_${shopOrderId} — room size: ${room ? room.size : 0}`)
            io.to(`track_${shopOrderId}`).emit("deliveryLocationUpdate", {
                latitude,
                longitude
            });
        });

        socket.on("disconnect", () => {
            console.log(`[socket] disconnected: ${socket.id}`)
        });
    });

    return io;
};

export const getIo = () => io;