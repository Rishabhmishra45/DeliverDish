import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import Nav from '../components/Nav'
import { IoFastFoodOutline } from 'react-icons/io5'
import { FaPhone, FaLocationDot, FaRegCopy, FaCheck } from 'react-icons/fa6'

const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    preparing: "bg-blue-100 text-blue-700",
    "out for delivery": "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700"
}

// har status ke baad agla valid step
const nextStatusMap = {
    pending: "preparing",
    preparing: "out for delivery",
    "out for delivery": "delivered"
}

const nextStatusLabel = {
    preparing: "Mark as Preparing",
    "out for delivery": "Mark Out for Delivery",
    delivered: "Mark as Delivered"
}

const OwnerOrders = () => {

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState(null)
    const [copiedOrderId, setCopiedOrderId] = useState(null)

    const fetchOrders = async () => {
        try {

            const result = await axios.get(
                `${serverUrl}/api/order/owner-orders`,
                { withCredentials: true }
            )

            setOrders(result.data)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()

        // har 5 second me silently naye orders/status check karo
        const interval = setInterval(fetchOrders, 5000)

        return () => clearInterval(interval)
    }, [])

    const handleUpdateStatus = async (orderId, newStatus) => {

        setUpdatingId(orderId)

        // optimistic UI update — turant local state update, backend background me confirm karega
        setOrders((prev) =>
            prev.map((o) =>
                o._id === orderId
                    ? { ...o, shopOrder: { ...o.shopOrder, status: newStatus } }
                    : o
            )
        )

        try {

            await axios.post(
                `${serverUrl}/api/order/update-status/${orderId}`,
                { status: newStatus },
                { withCredentials: true }
            )

        } catch (error) {
            console.log(error)
            // fail hone par fresh data se revert kar do
            fetchOrders()
        } finally {
            setUpdatingId(null)
        }
    }

    const handleCopyOrderId = (orderId) => {
        navigator.clipboard.writeText(orderId)
        setCopiedOrderId(orderId)
        setTimeout(() => {
            setCopiedOrderId(null)
        }, 1500)
    }

    return (
        <div className='min-h-screen bg-[#fff9f6]'>
            <Nav />

            <div className='pt-[90px] px-4 sm:px-6 pb-10 max-w-3xl mx-auto'>

                <h1 className='text-xl sm:text-2xl font-bold text-gray-800 mb-6'>
                    Orders
                </h1>

                {loading
                    ? (
                        <p className='text-gray-500 text-center mt-10'>Loading...</p>
                    )
                    : orders.length === 0
                        ? (
                            <p className='text-gray-500 text-center mt-10'>
                                No orders yet.
                            </p>
                        )
                        : (
                            <div className='flex flex-col gap-4'>
                                {orders.map((order) => {

                                    const status = order.shopOrder?.status
                                    const upcoming = nextStatusMap[status]
                                    const isUpdating = updatingId === order._id

                                    return (
                                        <div
                                            key={order._id}
                                            className='bg-white rounded-2xl shadow-md border border-orange-100 p-4 sm:p-5'
                                        >
                                            <div className='flex items-center justify-between mb-2 flex-wrap gap-2'>
                                                <p className='text-xs sm:text-sm text-gray-500'>
                                                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                        day: "numeric", month: "short", year: "numeric"
                                                    })}
                                                </p>
                                                <span className={`text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[status] || "bg-gray-100 text-gray-700"}`}>
                                                    {status}
                                                </span>
                                            </div>

                                            <div className='flex items-center gap-2 mb-3'>
                                                <p className='text-[10px] sm:text-xs text-gray-400'>
                                                    Order ID: <span className='font-mono text-gray-500'>{order._id}</span>
                                                </p>
                                                <button
                                                    onClick={() => handleCopyOrderId(order._id)}
                                                    className='text-gray-400 hover:text-[#ff4d2d] transition-colors duration-200 cursor-pointer'
                                                    title="Copy order ID"
                                                >
                                                    {copiedOrderId === order._id
                                                        ? <FaCheck size={11} className='text-green-500' />
                                                        : <FaRegCopy size={11} />
                                                    }
                                                </button>
                                            </div>

                                            <div className='flex items-center justify-between mb-3'>
                                                <p className='text-sm sm:text-base font-semibold text-gray-800'>
                                                    {order.user?.fullName}
                                                </p>
                                                {order.user?.mobile && (
                                                    <a
                                                        href={`tel:${order.user.mobile}`}
                                                        className='flex items-center gap-1.5 text-xs sm:text-sm text-[#ff4d2d] hover:underline'
                                                    >
                                                        <FaPhone size={11} />
                                                        {order.user.mobile}
                                                    </a>
                                                )}
                                            </div>

                                            <div className='flex items-start gap-1.5 mb-3 text-xs sm:text-sm text-gray-600'>
                                                <FaLocationDot size={13} className='text-[#ff4d2d] mt-0.5 flex-shrink-0' />
                                                <p>{order.deliveryAddress?.text}</p>
                                            </div>

                                            <div className='border-t border-gray-100 pt-3 flex flex-col gap-2'>
                                                {order.shopOrder?.items?.map((i, idx) => (
                                                    <div key={i._id || idx} className='flex items-center gap-3 text-xs sm:text-sm text-gray-600'>
                                                        {i.item?.image
                                                            ? (
                                                                <img
                                                                    src={i.item.image}
                                                                    alt={i.item?.name}
                                                                    className='w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0 border border-gray-200'
                                                                />
                                                            )
                                                            : (
                                                                <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 border border-gray-200'>
                                                                    <IoFastFoodOutline className='text-[#ff4d2d]' size={18} />
                                                                </div>
                                                            )
                                                        }
                                                        <div className='flex-1 flex items-center justify-between'>
                                                            <p>{i.item?.name} x {i.quantity}</p>
                                                            <p>₹{(i.price * i.quantity).toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className='border-t border-gray-200 mt-3 pt-3 flex items-center justify-between'>
                                                <p className='text-sm sm:text-base font-semibold text-gray-800'>
                                                    Subtotal
                                                </p>
                                                <p className='text-sm sm:text-base font-bold text-[#ff4d2d]'>
                                                    ₹{order.shopOrder?.subtotal?.toFixed(2)}
                                                </p>
                                            </div>

                                            <p className='text-[10px] sm:text-xs text-gray-400 mt-1'>
                                                {order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"}
                                            </p>

                                            {/* Status action buttons */}
                                            {status !== "delivered" && status !== "cancelled" &&
                                                <div className='flex gap-2 mt-4'>
                                                    {upcoming &&
                                                        <button
                                                            onClick={() => handleUpdateStatus(order._id, upcoming)}
                                                            disabled={isUpdating}
                                                            className='flex-1 bg-[#ff4d2d] text-white text-xs sm:text-sm font-medium py-2.5 rounded-full hover:bg-orange-600 transition-colors duration-200 disabled:opacity-60'
                                                        >
                                                            {isUpdating ? "Updating..." : nextStatusLabel[upcoming]}
                                                        </button>
                                                    }
                                                    <button
                                                        onClick={() => handleUpdateStatus(order._id, "cancelled")}
                                                        disabled={isUpdating}
                                                        className='px-4 bg-red-50 text-red-500 text-xs sm:text-sm font-medium py-2.5 rounded-full hover:bg-red-100 transition-colors duration-200 disabled:opacity-60'
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            }

                                        </div>
                                    )
                                })}
                            </div>
                        )
                }

            </div>
        </div>
    )
}

export default OwnerOrders