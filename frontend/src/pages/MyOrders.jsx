import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import Nav from '../components/Nav'
import RateItemModal from '../components/RateItemModal'
import { useNavigate } from 'react-router-dom'
import { FaChevronDown, FaChevronUp, FaRegCopy, FaCheck, FaStar } from 'react-icons/fa6'
import { IoFastFoodOutline } from 'react-icons/io5'
import { IoIosArrowRoundBack } from 'react-icons/io'

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  preparing: "bg-blue-100 text-blue-700",
  "out for delivery": "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700"
}

const formatDateTime = (dateStr) => {
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true
  })
}

const MyOrders = () => {

  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrders, setExpandedOrders] = useState({})
  const [copiedOrderId, setCopiedOrderId] = useState(null)
  const [reviewedItemIds, setReviewedItemIds] = useState({})
  const [rateModal, setRateModal] = useState(null)
  const [tipInputs, setTipInputs] = useState({})
  const [tippingId, setTippingId] = useState(null)

  const fetchOrders = async (isInitial = false) => {
    try {

      const result = await axios.get(
        `${serverUrl}/api/order/my-orders`,
        { withCredentials: true }
      )

      setOrders(result.data)

    } catch (error) {
      console.log(error)
    } finally {
      if (isInitial) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {

    fetchOrders(true)

    const interval = setInterval(() => fetchOrders(false), 5000)

    return () => clearInterval(interval)

  }, [])

  const toggleExpand = async (orderId) => {

    const willExpand = !expandedOrders[orderId]

    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: willExpand
    }))

    // expand hote waqt is order ke liye already-diye-gaye reviews check kar lo
    if (willExpand && !reviewedItemIds[orderId]) {
      try {
        const result = await axios.get(
          `${serverUrl}/api/review/my-reviews/${orderId}`,
          { withCredentials: true }
        )
        const itemIds = result.data.map((r) => r.item)
        setReviewedItemIds((prev) => ({ ...prev, [orderId]: itemIds }))
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleCopyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId)
    setCopiedOrderId(orderId)
    setTimeout(() => {
      setCopiedOrderId(null)
    }, 1500)
  }

  const handleReviewSuccess = (orderId, itemId) => {
    setReviewedItemIds((prev) => ({
      ...prev,
      [orderId]: [...(prev[orderId] || []), itemId]
    }))
  }

  const handleTipChange = (shopOrderId, value) => {
    setTipInputs((prev) => ({ ...prev, [shopOrderId]: value }))
  }

  const handleSendTip = async (orderId, shopOrderId) => {

    const amount = Number(tipInputs[shopOrderId])
    if (!amount || amount <= 0) return

    setTippingId(shopOrderId)

    try {

      await axios.post(
        `${serverUrl}/api/order/add-tip/${orderId}/${shopOrderId}`,
        { tip: amount },
        { withCredentials: true }
      )

      fetchOrders(false)

    } catch (error) {
      console.log(error)
    } finally {
      setTippingId(null)
    }
  }

  return (
    <div className='min-h-screen bg-[#fff9f6]'>
      <Nav />

      <div className='pt-[90px] px-4 sm:px-6 pb-10 max-w-3xl mx-auto'>

        <div className='flex items-center gap-3 mb-6'>
          <button onClick={() => navigate(-1)} className='cursor-pointer'>
            <IoIosArrowRoundBack size={30} className='text-[#ff4d2d]' />
          </button>
          <h1 className='text-xl sm:text-2xl font-bold text-gray-800'>
            My Orders
          </h1>
        </div>

        {loading
          ? (
            <p className='text-gray-500 text-center mt-10'>Loading...</p>
          )
          : orders.length === 0
            ? (
              <p className='text-gray-500 text-center mt-10'>
                You haven't placed any orders yet.
              </p>
            )
            : (
              <div className='flex flex-col gap-4'>
                {orders.map((order) => {

                  const isExpanded = !!expandedOrders[order._id]
                  const reviewedIds = reviewedItemIds[order._id] || []

                  return (
                    <div
                      key={order._id}
                      className='bg-white rounded-2xl shadow-md border border-orange-100 p-4 sm:p-5 hover:shadow-lg transition-shadow duration-200'
                    >
                      <div className='flex items-center justify-between mb-1 flex-wrap gap-2'>
                        <p className='text-xs sm:text-sm text-gray-500'>
                          {formatDateTime(order.createdAt)}
                        </p>
                        <p className='text-xs sm:text-sm font-medium text-gray-700'>
                          {order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"}
                        </p>
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

                      <div
                        onClick={() => toggleExpand(order._id)}
                        className='flex items-center justify-between cursor-pointer select-none'
                      >
                        <p className='text-sm sm:text-base font-semibold text-gray-800'>
                          {order.shopOrders.length} shop{order.shopOrders.length > 1 ? "s" : ""} · ₹{order.totalAmount.toFixed(2)}
                        </p>
                        <button className='text-gray-500 hover:text-[#ff4d2d] transition-colors duration-200'>
                          {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className='mt-3'>
                          {order.shopOrders.map((shopOrder) => (
                            <div key={shopOrder._id} className='border-t border-gray-100 pt-3 mt-3 first:border-t-0 first:pt-0 first:mt-0'>
                              <div className='flex items-center justify-between mb-2'>
                                <p className='text-sm sm:text-base font-semibold text-gray-800'>
                                  {shopOrder.shop?.name}
                                </p>
                                <span className={`text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[shopOrder.status] || "bg-gray-100 text-gray-700"}`}>
                                  {shopOrder.status}
                                </span>
                              </div>

                              {shopOrder.status === "delivered" && shopOrder.deliveredAt &&
                                <p className='text-[10px] sm:text-xs text-gray-400 mb-2'>
                                  Delivered on {formatDateTime(shopOrder.deliveredAt)}
                                </p>
                              }

                              <div className='flex flex-col gap-2'>
                                {shopOrder.items.map((i) => {

                                  const alreadyReviewed = reviewedIds.includes(i.item?._id)

                                  return (
                                    <div key={i._id} className='flex items-center gap-3 text-xs sm:text-sm text-gray-600'>
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
                                        <div className='flex items-center gap-2'>
                                          <p>₹{(i.price * i.quantity).toFixed(2)}</p>
                                          {shopOrder.status === "delivered" &&
                                            (alreadyReviewed
                                              ? (
                                                <span className='flex items-center gap-1 text-[10px] sm:text-xs text-green-600 font-medium'>
                                                  <FaStar size={10} /> Rated
                                                </span>
                                              )
                                              : (
                                                <button
                                                  onClick={() => setRateModal({ item: i, orderId: order._id, shopOrderId: shopOrder._id })}
                                                  className='text-[10px] sm:text-xs text-[#ff4d2d] font-medium border border-[#ff4d2d] px-2 py-1 rounded-full hover:bg-orange-50 transition-colors duration-200'
                                                >
                                                  Rate
                                                </button>
                                              )
                                            )
                                          }
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>

                              {shopOrder.status === "delivered" &&
                                (shopOrder.tip > 0
                                  ? (
                                    <p className='mt-3 text-xs sm:text-sm text-green-600 font-medium'>
                                      You tipped ₹{shopOrder.tip} to the delivery partner 🎉
                                    </p>
                                  )
                                  : (
                                    <div className='mt-3 flex items-center gap-2'>
                                      <input
                                        type="number"
                                        min={1}
                                        placeholder='Tip amount (₹)'
                                        value={tipInputs[shopOrder._id] || ""}
                                        onChange={(e) => handleTipChange(shopOrder._id, e.target.value)}
                                        className='flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#ff4d2d] text-sm'
                                      />
                                      <button
                                        onClick={() => handleSendTip(order._id, shopOrder._id)}
                                        disabled={tippingId === shopOrder._id}
                                        className='px-4 py-2 bg-[#ff4d2d] text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors duration-200 disabled:opacity-60'
                                      >
                                        {tippingId === shopOrder._id ? "Sending..." : "Send Tip"}
                                      </button>
                                    </div>
                                  )
                                )
                              }

                              {shopOrder.status === "out for delivery" && shopOrder.deliveryBoy &&
                                <button
                                  onClick={() => navigate(`/track-order/${order._id}/${shopOrder._id}`)}
                                  className='w-full mt-3 bg-[#ff4d2d] text-white text-xs sm:text-sm font-medium py-2.5 rounded-full hover:bg-orange-600 transition-colors duration-200'
                                >
                                  Track Order
                                </button>
                              }
                            </div>
                          ))}
                        </div>
                      )}

                      <div className='border-t border-gray-200 mt-3 pt-3 flex items-center justify-between'>
                        <p className='text-sm sm:text-base font-semibold text-gray-800'>Total Paid</p>
                        <p className='text-sm sm:text-base font-bold text-[#ff4d2d]'>₹{order.totalAmount.toFixed(2)}</p>
                      </div>

                    </div>
                  )
                })}
              </div>
            )
        }

      </div>

      {rateModal &&
        <RateItemModal
          item={rateModal.item}
          orderId={rateModal.orderId}
          shopOrderId={rateModal.shopOrderId}
          onClose={() => setRateModal(null)}
          onSuccess={(itemId) => handleReviewSuccess(rateModal.orderId, itemId)}
        />
      }

    </div>
  )
}

export default MyOrders