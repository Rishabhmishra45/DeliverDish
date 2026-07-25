import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { FaLocationDot, FaMoneyBillWave, FaCircleCheck } from 'react-icons/fa6'
import { IoSearch } from 'react-icons/io5'
import { MdMyLocation, MdPayment } from 'react-icons/md'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { serverUrl } from '../App'
import { setCartItems } from '../redux/cartSlice'
import Nav from '../components/Nav'
import Toast from '../components/Toast'
import useToast from '../hooks/useToast'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

const RecenterMap = ({ latitude, longitude }) => {
  const map = useMap()
  useEffect(() => {
    if (latitude && longitude) {
      map.setView([latitude, longitude], 16)
    }
  }, [latitude, longitude])
  return null
}

const DELIVERY_FEE = 40

const Checkout = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { cartItems } = useSelector(state => state.cart)
  const { userData } = useSelector(state => state.user)
  const { toast, triggerToast } = useToast()

  const apiKey = import.meta.env.VITE_GEOAPIKEY

  const [addressText, setAddressText] = useState("")
  const [coords, setCoords] = useState({ latitude: null, longitude: null })
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const subtotal = cartItems?.reduce(
    (total, c) => total + (c.item?.price || 0) * c.quantity, 0
  ) || 0

  const totalPrice = subtotal + DELIVERY_FEE

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
      )
      const locationData = result?.data?.results?.[0]
      const formatted = locationData?.formatted
      if (formatted) {
        setAddressText(formatted)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) return

    setLocating(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        setCoords({ latitude, longitude })
        await reverseGeocode(latitude, longitude)
        setLocating(false)
      },
      (error) => {
        console.log(error)
        setLocating(false)
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 1000 * 60 * 30
      }
    )
  }

  useEffect(() => {
    fetchCurrentLocation()
  }, [])

  const handleMarkerDrag = async (e) => {
    const marker = e.target
    const position = marker.getLatLng()
    setCoords({ latitude: position.lat, longitude: position.lng })
    await reverseGeocode(position.lat, position.lng)
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePlaceOrder = async () => {

    if (!addressText.trim()) {
      triggerToast("Please enter a delivery address", "error")
      return
    }

    setLoading(true)

    try {

      const deliveryAddress = {
        text: addressText,
        latitude: coords.latitude,
        longitude: coords.longitude
      }

      if (paymentMethod === "cod") {

        const result = await axios.post(
          `${serverUrl}/api/order/place-order`,
          { paymentMethod: "cod", deliveryAddress },
          { withCredentials: true }
        )

        dispatch(setCartItems([]))
        setOrderId(result.data.order._id)
        setOrderPlaced(true)

      } else {

        const result = await axios.post(
          `${serverUrl}/api/order/place-order`,
          { paymentMethod: "online", deliveryAddress },
          { withCredentials: true }
        )

        const scriptLoaded = await loadRazorpayScript()
        if (!scriptLoaded) {
          triggerToast("Failed to load payment gateway", "error")
          setLoading(false)
          return
        }

        const options = {
          key: result.data.key,
          amount: result.data.amount,
          currency: "INR",
          name: "DeliverDish",
          description: "Food order payment",
          order_id: result.data.razorpayOrderId,
          handler: async (response) => {
            try {

              const verifyResult = await axios.post(
                `${serverUrl}/api/order/verify-payment`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                },
                { withCredentials: true }
              )

              dispatch(setCartItems([]))
              setOrderId(verifyResult.data.order._id)
              setOrderPlaced(true)

            } catch (error) {
              console.log(error)
              triggerToast("Payment verification failed", "error")
            }
          },
          prefill: {
            name: userData?.fullName || "",
            email: userData?.email || "",
            contact: userData?.mobile || ""
          },
          theme: {
            color: "#ff4d2d"
          },
          modal: {
            ondismiss: () => {
              setLoading(false)
            }
          }
        }

        const razorpay = new window.Razorpay(options)
        razorpay.open()

      }

    } catch (error) {
      console.log(error)
      triggerToast("Something went wrong", "error")
    } finally {
      if (paymentMethod === "cod") {
        setLoading(false)
      }
    }
  }

  if (orderPlaced) {
    return (
      <div className='min-h-screen bg-[#fff9f6]'>
        <Nav />
        <div className='pt-[90px] px-4 flex flex-col items-center justify-center text-center' style={{ minHeight: 'calc(100vh - 90px)' }}>
          <FaCircleCheck className='text-green-500' size={70} />
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 mt-5'>
            Order Placed!
          </h1>
          <p className='text-gray-500 text-sm sm:text-base mt-2 max-w-sm'>
            Thank you for your purchase. Your order is being prepared. You can track your order status in the "My Orders" section.
          </p>
          {orderId && (
            <p className='text-gray-600 text-xs sm:text-sm mt-3 bg-orange-50 border border-orange-100 px-4 py-2 rounded-lg'>
              Order ID: <span className='font-semibold text-[#ff4d2d]'>{orderId}</span>
            </p>
          )}
          <button
            onClick={() => navigate("/my-orders")}
            className='mt-6 bg-[#ff4d2d] text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-orange-600 transition-colors duration-200'
          >
            Back to my orders
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#fff9f6]'>
      <Nav />
      <Toast toast={toast} />

      <div className='pt-[90px] px-4 sm:px-6 pb-10 max-w-2xl mx-auto'>

        <div className='flex items-center gap-3 mb-5'>
          <button onClick={() => navigate(-1)} className='cursor-pointer'>
            <IoIosArrowRoundBack size={30} className='text-[#ff4d2d]' />
          </button>
          <h1 className='text-xl sm:text-2xl font-bold text-gray-800'>Checkout</h1>
        </div>

        {(!cartItems || cartItems.length === 0)
          ? (
            <p className='text-gray-500 text-center mt-10'>
              Your cart is empty.
            </p>
          )
          : (
            <div className='bg-white rounded-2xl shadow-lg border border-orange-100 p-4 sm:p-6 flex flex-col gap-5'>

              {/* Delivery Location */}
              <div>
                <div className='flex items-center gap-1.5 mb-2'>
                  <FaLocationDot className='text-[#ff4d2d]' size={16} />
                  <h3 className='text-sm sm:text-base font-semibold text-gray-800'>
                    Delivery Location
                  </h3>
                </div>

                <div className='flex items-center gap-2'>
                  <input
                    type="text"
                    value={addressText}
                    onChange={(e) => setAddressText(e.target.value)}
                    placeholder='Enter your delivery address'
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#ff4d2d] text-sm'
                  />
                  <button
                    type='button'
                    className='w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-lg bg-[#ff4d2d] text-white hover:bg-orange-600 transition-colors duration-200'
                  >
                    <IoSearch size={16} />
                  </button>
                  <button
                    type='button'
                    onClick={fetchCurrentLocation}
                    className='w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200'
                  >
                    <MdMyLocation size={16} className={locating ? 'animate-spin' : ''} />
                  </button>
                </div>

                <div className='w-full h-[220px] sm:h-[260px] rounded-lg overflow-hidden mt-3 border border-gray-200'>
                  {coords.latitude && coords.longitude
                    ? (
                      <MapContainer
                        center={[coords.latitude, coords.longitude]}
                        zoom={16}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; OpenStreetMap contributors'
                        />
                        <Marker
                          position={[coords.latitude, coords.longitude]}
                          draggable={true}
                          eventHandlers={{ dragend: handleMarkerDrag }}
                        />
                        <RecenterMap latitude={coords.latitude} longitude={coords.longitude} />
                      </MapContainer>
                    )
                    : (
                      <div className='w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 text-sm'>
                        Fetching location...
                      </div>
                    )
                  }
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className='text-sm sm:text-base font-semibold text-gray-800 mb-2'>
                  Payment Method
                </h3>
                <div className='grid grid-cols-2 gap-3'>
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-colors duration-200 ${
                      paymentMethod === "cod" ? "border-[#ff4d2d] bg-orange-50" : "border-gray-200"
                    }`}
                  >
                    <div className='w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0'>
                      <FaMoneyBillWave className='text-[#ff4d2d]' size={14} />
                    </div>
                    <div>
                      <p className='text-xs sm:text-sm font-semibold text-gray-800'>Cash on Delivery</p>
                      <p className='text-[10px] sm:text-xs text-gray-500'>Pay when your food arrives</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("online")}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-colors duration-200 ${
                      paymentMethod === "online" ? "border-[#ff4d2d] bg-orange-50" : "border-gray-200"
                    }`}
                  >
                    <div className='w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0'>
                      <MdPayment className='text-[#ff4d2d]' size={16} />
                    </div>
                    <div>
                      <p className='text-xs sm:text-sm font-semibold text-gray-800'>UPI / Credit / Debit Card</p>
                      <p className='text-[10px] sm:text-xs text-gray-500'>Pay securely online</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className='text-sm sm:text-base font-semibold text-gray-800 mb-2'>
                  Order Summary
                </h3>
                <div className='bg-gray-50 rounded-xl p-3 sm:p-4 flex flex-col gap-2'>
                  {cartItems.map((c) => (
                    <div key={c.item._id} className='flex items-center justify-between text-xs sm:text-sm text-gray-600'>
                      <p>{c.item.name} x {c.quantity}</p>
                      <p>₹{(c.item.price * c.quantity).toFixed(2)}</p>
                    </div>
                  ))}

                  <div className='border-t border-gray-200 my-1'></div>

                  <div className='flex items-center justify-between text-xs sm:text-sm text-gray-700 font-medium'>
                    <p>Subtotal</p>
                    <p>₹{subtotal.toFixed(2)}</p>
                  </div>
                  <div className='flex items-center justify-between text-xs sm:text-sm text-gray-700'>
                    <p>Delivery Fee</p>
                    <p>₹{DELIVERY_FEE}</p>
                  </div>

                  <div className='border-t border-gray-200 my-1'></div>

                  <div className='flex items-center justify-between'>
                    <p className='text-sm sm:text-base font-bold text-[#ff4d2d]'>Total</p>
                    <p className='text-sm sm:text-base font-bold text-[#ff4d2d]'>₹{totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className='w-full bg-[#ff4d2d] text-white py-3 rounded-full font-semibold shadow-md hover:bg-orange-600 transition-colors duration-200 disabled:opacity-60'
              >
                {loading ? "Processing..." : "Place Order"}
              </button>

            </div>
          )
        }

      </div>
    </div>
  )
}

export default Checkout