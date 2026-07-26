import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { socket } from '../socket'
import Nav from '../components/Nav'
import { IoFastFoodOutline } from 'react-icons/io5'
import { FaPhone, FaLocationDot } from 'react-icons/fa6'
import { MdSpaceDashboard, MdCheckCircle, MdBarChart } from 'react-icons/md'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import scooterIcon from '../assets/scooter.png'
import homeIcon from '../assets/home.png'

const scooterMarker = new L.Icon({
  iconUrl: scooterIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20]
})

const homeMarker = new L.Icon({
  iconUrl: homeIcon,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18]
})

const RecenterMap = ({ latitude, longitude }) => {
  const map = useMap()
  useEffect(() => {
    if (latitude && longitude) {
      map.setView([latitude, longitude], map.getZoom() < 13 ? 14 : map.getZoom())
    }
  }, [latitude, longitude])
  return null
}

const sidebarItems = [
  { key: "home", label: "Home", icon: MdSpaceDashboard },
  { key: "delivered", label: "Delivered", icon: MdCheckCircle },
  { key: "chart", label: "Analytics", icon: MdBarChart }
]

const DeliveryBoy = () => {

  const { userData } = useSelector(state => state.user)

  const [activeTab, setActiveTab] = useState("home")
  const [availableOrders, setAvailableOrders] = useState([])
  const [myDeliveries, setMyDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [acceptingId, setAcceptingId] = useState(null)
  const [deliveringId, setDeliveringId] = useState(null)
  const [errorMsg, setErrorMsg] = useState("")
  const [coords, setCoords] = useState({ latitude: null, longitude: null })

  const fetchData = async (isInitial = false) => {
    try {

      const [availableResult, deliveriesResult] = await Promise.all([
        axios.get(`${serverUrl}/api/order/delivery-orders`, { withCredentials: true }),
        axios.get(`${serverUrl}/api/order/my-deliveries`, { withCredentials: true })
      ])

      setAvailableOrders(availableResult.data)
      setMyDeliveries(deliveriesResult.data)

    } catch (error) {
      console.log(error)
    } finally {
      if (isInitial) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchData(true)

    const interval = setInterval(() => fetchData(false), 5000)

    return () => clearInterval(interval)
  }, [])

  const ongoingDeliveries = myDeliveries.filter((d) => d.shopOrder.status !== "delivered")
  const pastDeliveries = myDeliveries.filter((d) => d.shopOrder.status === "delivered")

  // live location fetch + backend me save + socket se ongoing deliveries ke room me broadcast
  useEffect(() => {
    if (!navigator.geolocation) return

    const sendLocation = (latitude, longitude) => {
      setCoords({ latitude, longitude })

      axios.post(
        `${serverUrl}/api/user/update-location`,
        { latitude, longitude },
        { withCredentials: true }
      ).catch((error) => console.log(error))

      ongoingDeliveries.forEach((d) => {
        socket.emit("updateDeliveryLocation", {
          shopOrderId: d.shopOrder._id,
          latitude,
          longitude
        })
      })
    }

    navigator.geolocation.getCurrentPosition(
      (position) => sendLocation(position.coords.latitude, position.coords.longitude),
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    )

    const watchId = navigator.geolocation.watchPosition(
      (position) => sendLocation(position.coords.latitude, position.coords.longitude),
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [ongoingDeliveries.length])

  const handleAccept = async (orderId, shopOrderId) => {

    setAcceptingId(shopOrderId)
    setErrorMsg("")

    try {

      await axios.post(
        `${serverUrl}/api/order/accept-order/${orderId}/${shopOrderId}`,
        {},
        { withCredentials: true }
      )

      fetchData(false)

    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Failed to accept order")
      fetchData(false)
    } finally {
      setAcceptingId(null)
    }
  }

  const handleMarkDelivered = async (orderId, shopOrderId) => {

    setDeliveringId(shopOrderId)

    try {

      await axios.post(
        `${serverUrl}/api/order/mark-delivered/${orderId}/${shopOrderId}`,
        {},
        { withCredentials: true }
      )

      fetchData(false)

    } catch (error) {
      console.log(error)
    } finally {
      setDeliveringId(null)
    }
  }

  // today's + monthly delivered-orders stats, delivery ki createdAt date ke hisaab se
  const { todayCount, monthlyChartData, monthTotal } = useMemo(() => {

    const now = new Date()
    const todayStr = now.toDateString()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

    const dayCounts = {}
    for (let d = 1; d <= daysInMonth; d++) {
      dayCounts[d] = 0
    }

    let todayTotal = 0

    pastDeliveries.forEach((d) => {
      const date = new Date(d.createdAt)
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        dayCounts[date.getDate()] += 1
      }
      if (date.toDateString() === todayStr) {
        todayTotal += 1
      }
    })

    const chartData = Object.keys(dayCounts).map((day) => ({
      day,
      orders: dayCounts[day]
    }))

    const total = chartData.reduce((sum, d) => sum + d.orders, 0)

    return { todayCount: todayTotal, monthlyChartData: chartData, monthTotal: total }

  }, [pastDeliveries])

  const renderOrderCard = (order, actionButton, showMap = false) => {

    const customerLat = order.deliveryAddress?.latitude
    const customerLon = order.deliveryAddress?.longitude

    const points = coords.latitude && customerLat
      ? [[coords.latitude, coords.longitude], [customerLat, customerLon]]
      : []

    return (
      <div
        key={order.shopOrder._id}
        className='bg-white rounded-2xl shadow-md border border-orange-100 p-4 sm:p-5'
      >
        <div className='flex items-center justify-between mb-2'>
          <p className='text-sm sm:text-base font-semibold text-gray-800'>
            {order.shopOrder.shop?.name}
          </p>
          <p className='text-xs sm:text-sm text-gray-500'>
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "short"
            })}
          </p>
        </div>

        <div className='flex items-center justify-between mb-3'>
          <p className='text-sm text-gray-700'>{order.user?.fullName}</p>
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

        {showMap && coords.latitude && customerLat && (
          <div className='w-full h-[200px] sm:h-[220px] rounded-lg overflow-hidden mb-3 border border-gray-200'>
            <MapContainer
              center={[coords.latitude, coords.longitude]}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <Marker position={[coords.latitude, coords.longitude]} icon={scooterMarker}>
                <Popup>You (Delivery Partner)</Popup>
              </Marker>
              <Marker position={[customerLat, customerLon]} icon={homeMarker}>
                <Popup>Customer's delivery address</Popup>
              </Marker>
              {points.length === 2 &&
                <Polyline positions={points} pathOptions={{ color: "#2563eb", weight: 4 }} />
              }
              <RecenterMap latitude={coords.latitude} longitude={coords.longitude} />
            </MapContainer>
          </div>
        )}

        <div className='border-t border-gray-100 pt-3 flex flex-col gap-2'>
          {order.shopOrder.items.map((i, idx) => (
            <div key={i._id || idx} className='flex items-center gap-3 text-xs sm:text-sm text-gray-600'>
              {i.item?.image
                ? (
                  <img
                    src={i.item.image}
                    alt={i.item?.name}
                    className='w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0 border border-gray-200'
                  />
                )
                : (
                  <div className='w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 border border-gray-200'>
                    <IoFastFoodOutline className='text-[#ff4d2d]' size={16} />
                  </div>
                )
              }
              <p>{i.item?.name} x {i.quantity}</p>
            </div>
          ))}
        </div>

        <div className='border-t border-gray-200 mt-3 pt-3 flex items-center justify-between'>
          <p className='text-sm font-semibold text-gray-800'>Subtotal</p>
          <p className='text-sm font-bold text-[#ff4d2d]'>₹{order.shopOrder.subtotal?.toFixed(2)}</p>
        </div>

        {actionButton}
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#fff9f6]'>
      <Nav />

      <div className='pt-[70px] flex'>

        {/* Sidebar */}
        <div className='w-16 sm:w-56 min-h-[calc(100vh-70px)] bg-white border-r border-orange-100 flex flex-col py-4 sm:py-6 sticky top-[70px]'>
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.key
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center gap-3 px-3 sm:px-5 py-3 mx-2 sm:mx-3 rounded-xl transition-colors duration-200 ${
                  isActive ? "bg-[#ff4d2d] text-white" : "text-gray-600 hover:bg-orange-50"
                }`}
              >
                <Icon size={20} />
                <span className='hidden sm:inline text-sm font-medium'>{item.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className='flex-1 px-4 sm:px-6 py-6 max-w-3xl mx-auto flex flex-col gap-8'>

          {errorMsg &&
            <div className='bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3'>
              {errorMsg}
            </div>
          }

          {/* HOME TAB */}
          {activeTab === "home" &&
            <>
              {ongoingDeliveries.length > 0 &&
                <div>
                  <h2 className='text-lg sm:text-xl font-bold text-gray-800 mb-4'>
                    Ongoing Deliveries
                  </h2>
                  <div className='flex flex-col gap-4'>
                    {ongoingDeliveries.map((order) =>
                      renderOrderCard(
                        order,
                        <button
                          onClick={() => handleMarkDelivered(order._id, order.shopOrder._id)}
                          disabled={deliveringId === order.shopOrder._id}
                          className='w-full mt-4 bg-green-600 text-white text-sm font-medium py-2.5 rounded-full hover:bg-green-700 transition-colors duration-200 disabled:opacity-60'
                        >
                          {deliveringId === order.shopOrder._id ? "Updating..." : "Mark as Delivered"}
                        </button>,
                        true
                      )
                    )}
                  </div>
                </div>
              }

              <div>
                <h2 className='text-lg sm:text-xl font-bold text-gray-800 mb-4'>
                  New Orders
                </h2>

                {loading
                  ? <p className='text-gray-500 text-center mt-6'>Loading...</p>
                  : availableOrders.length === 0
                    ? <p className='text-gray-500 text-center mt-6'>No new orders available right now.</p>
                    : (
                      <div className='flex flex-col gap-4'>
                        {availableOrders.map((order) =>
                          renderOrderCard(
                            order,
                            <button
                              onClick={() => handleAccept(order._id, order.shopOrder._id)}
                              disabled={acceptingId === order.shopOrder._id}
                              className='w-full mt-4 bg-[#ff4d2d] text-white text-sm font-medium py-2.5 rounded-full hover:bg-orange-600 transition-colors duration-200 disabled:opacity-60'
                            >
                              {acceptingId === order.shopOrder._id ? "Accepting..." : "Accept Order"}
                            </button>
                          )
                        )}
                      </div>
                    )
                }
              </div>
            </>
          }

          {/* DELIVERED TAB */}
          {activeTab === "delivered" &&
            <div>
              <h2 className='text-lg sm:text-xl font-bold text-gray-800 mb-4'>
                Delivered Orders
              </h2>

              {pastDeliveries.length === 0
                ? <p className='text-gray-500 text-center mt-6'>No deliveries completed yet.</p>
                : (
                  <div className='flex flex-col gap-4'>
                    {pastDeliveries.map((order) => renderOrderCard(order, null))}
                  </div>
                )
              }
            </div>
          }

          {/* CHART / ANALYTICS TAB */}
          {activeTab === "chart" &&
            <>
              <div className='bg-white rounded-2xl shadow-md border border-orange-100 p-5 sm:p-6 text-center'>
                <h1 className='text-lg sm:text-xl font-bold text-[#ff4d2d]'>
                  Welcome, {userData?.fullName}
                </h1>
                <p className='text-xs sm:text-sm text-[#ff4d2d] mt-1'>
                  {coords.latitude && coords.longitude
                    ? <>
                        <span className='font-medium'>Latitude:</span> {coords.latitude.toFixed(7)}, {" "}
                        <span className='font-medium'>Longitude:</span> {coords.longitude.toFixed(7)}
                      </>
                    : "Fetching location..."
                  }
                </p>
              </div>

              <div className='bg-white rounded-2xl shadow-md border border-orange-100 p-5 sm:p-6'>
                <div className='flex items-center justify-between flex-wrap gap-3 mb-5'>
                  <h2 className='text-base sm:text-lg font-bold text-gray-800'>
                    My Deliveries
                  </h2>
                  <div className='flex gap-3'>
                    <div className='bg-orange-50 rounded-xl px-4 py-2 text-center'>
                      <p className='text-[10px] sm:text-xs text-gray-500'>Today</p>
                      <p className='text-base sm:text-lg font-bold text-[#ff4d2d]'>{todayCount}</p>
                    </div>
                    <div className='bg-orange-50 rounded-xl px-4 py-2 text-center'>
                      <p className='text-[10px] sm:text-xs text-gray-500'>This Month</p>
                      <p className='text-base sm:text-lg font-bold text-[#ff4d2d]'>{monthTotal}</p>
                    </div>
                  </div>
                </div>

                <div className='w-full h-[220px] sm:h-[260px]'>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#f3e8e4' />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 10, fill: '#9ca3af' }}
                        interval={window.innerWidth < 640 ? 4 : 1}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 10, fill: '#9ca3af' }}
                        width={25}
                      />
                      <Tooltip
                        cursor={{ fill: '#fff2ee' }}
                        contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #ffe0d5' }}
                        labelFormatter={(day) => `Day ${day}`}
                      />
                      <Bar dataKey="orders" fill="#ff4d2d" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          }

        </div>

      </div>
    </div>
  )
}

export default DeliveryBoy