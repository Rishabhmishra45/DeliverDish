import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import Nav from '../components/Nav'

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  preparing: "bg-blue-100 text-blue-700",
  "out for delivery": "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700"
}

const MyOrders = () => {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchOrders = async () => {
      try {

        const result = await axios.get(
          `${serverUrl}/api/order/my-orders`,
          { withCredentials: true }
        )

        setOrders(result.data)

      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()

  }, [])

  return (
    <div className='min-h-screen bg-[#fff9f6]'>
      <Nav />

      <div className='pt-[90px] px-4 sm:px-6 pb-10 max-w-3xl mx-auto'>

        <h1 className='text-xl sm:text-2xl font-bold text-gray-800 mb-6'>
          My Orders
        </h1>

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
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className='bg-white rounded-2xl shadow-md border border-orange-100 p-4 sm:p-5'
                  >
                    <div className='flex items-center justify-between mb-3'>
                      <p className='text-xs sm:text-sm text-gray-500'>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </p>
                      <p className='text-xs sm:text-sm font-medium text-gray-700'>
                        {order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"}
                      </p>
                    </div>

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

                        <div className='flex flex-col gap-1'>
                          {shopOrder.items.map((i, idx) => (
                            <div key={idx} className='flex items-center justify-between text-xs sm:text-sm text-gray-600'>
                              <p>{i.item?.name} x {i.quantity}</p>
                              <p>₹{(i.price * i.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className='border-t border-gray-200 mt-3 pt-3 flex items-center justify-between'>
                      <p className='text-sm sm:text-base font-semibold text-gray-800'>Total Paid</p>
                      <p className='text-sm sm:text-base font-bold text-[#ff4d2d]'>₹{order.totalAmount.toFixed(2)}</p>
                    </div>

                  </div>
                ))}
              </div>
            )
        }

      </div>
    </div>
  )
}

export default MyOrders