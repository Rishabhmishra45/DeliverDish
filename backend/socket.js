import { Server } from "socket.io"

let io

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    })

    io.on("connection", (socket) => {

        // user apne order ke tracking room me join karta hai
        socket.on("joinTrackRoom", (shopOrderId) => {
            socket.join(`track_${shopOrderId}`)
        })

        // delivery boy apni current location us shopOrder ke room me broadcast karta hai
        socket.on("updateDeliveryLocation", ({ shopOrderId, latitude, longitude }) => {
            io.to(`track_${shopOrderId}`).emit("deliveryLocationUpdate", { latitude, longitude })
        })

        socket.on("disconnect", () => {})
    })

    return io
}

export const getIo = () => io