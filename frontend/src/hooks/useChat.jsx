// frontend/src/hooks/useChat.jsx
import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { socket } from '../socket'

const useChat = (orderId, shopOrderId, initialStatus) => {
    const { userData } = useSelector(state => state.user)

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [locked, setLocked] = useState(initialStatus === "delivered")

    // history load — sirf tab jab locked na ho
    useEffect(() => {
        if (locked || !orderId || !shopOrderId) {
            setLoading(false)
            return
        }

        const fetchHistory = async () => {
            try {
                const result = await axios.get(
                    `${serverUrl}/api/message/${orderId}/${shopOrderId}`,
                    { withCredentials: true }
                )
                setMessages(result.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchHistory()
    }, [orderId, shopOrderId, locked])

    // live messages + delivered hote hi turant lock
    useEffect(() => {
        if (!shopOrderId) return

        const handleNewMessage = (msg) => {
            if (msg.shopOrderId === shopOrderId) {
                setMessages(prev => [...prev, msg])
            }
        }

        const handleStatusUpdate = ({ shopOrderId: sId, status }) => {
            if (sId === shopOrderId && status === "delivered") {
                setLocked(true)
                setMessages([]) // purane messages bhi hata do view se
            }
        }

        socket.on("newMessage", handleNewMessage)
        socket.on("orderStatusUpdate", handleStatusUpdate)

        return () => {
            socket.off("newMessage", handleNewMessage)
            socket.off("orderStatusUpdate", handleStatusUpdate)
        }
    }, [shopOrderId])

    const sendMessage = useCallback((text, senderRole) => {
        if (locked || !text.trim()) return
        socket.emit("sendMessage", {
            orderId,
            shopOrderId,
            senderId: userData?._id,
            senderRole,
            text: text.trim()
        })
    }, [orderId, shopOrderId, userData?._id, locked])

    return { messages, loading, locked, sendMessage, currentUserId: userData?._id }
}

export default useChat