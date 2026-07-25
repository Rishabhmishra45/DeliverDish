import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { socket } from '../socket'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

const FitBounds = ({ points }) => {
  const map = useMap()
  useEffect(() => {
    if (points.length === 2) {
      map.fitBounds(points, { padding: [40, 40] })
    }
  }, [points])
  return null
}

const TrackOrder = () => {

  const { orderId, shopOrderId } = useParams()
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [boyLocation, setBoyLocation] = useState(null)

  useEffect(() => {

    const fetchTrackData = async () => {
      try {

        const result = await axios.get(
          `${serverUrl}/api/order/track-order/${orderId}/${shopOrderId}`,
          { withCredentials: true }
        )

        setData(result.data)

        if (result.data.deliveryBoy?.location) {
          setBoyLocation(result.data.deliveryBoy.location)
        }

      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrackData()

  }, [orderId, shopOrderId])

  // Socket.io se real-time delivery boy location updates
  useEffect(() => {

    socket.emit("joinTrackRoom", shopOrderId)

    const handleLocationUpdate = (location) => {
      setBoyLocation(location)
    }

    socket.on("deliveryLocationUpdate", handleLocationUpdate)

    return () => {
      socket.off("deliveryLocationUpdate", handleLocationUpdate)
    }

  }, [shopOrderId])

  if (loading) {
    return (
      <div className='w-full min-h-screen flex items-center justify-center bg-[#fff9f6]'>
        <div className='w-10 h-10 border-4 border-[#ff4d2d] border-t-transparent rounded-full animate-spin'></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className='w-full min-h-screen flex items-center justify-center bg-[#fff9f6]'>
        <p className='text-gray-500'>Unable to load tracking details.</p>
      </div>
    )
  }

  const customerLat = data.deliveryAddress?.latitude
  const customerLon = data.deliveryAddress?.longitude

  const points = boyLocation?.latitude && customerLat
    ? [[boyLocation.latitude, boyLocation.longitude], [customerLat, customerLon]]
    : []

  return (
    <div className='w-full min-h-screen bg-[#fff9f6] px-4 sm:px-6 py-5'>

      <div className='flex items-center gap-3 mb-5 max-w-2xl mx-auto'>
        <button onClick={() => navigate(-1)} className='cursor-pointer'>
          <IoIosArrowRoundBack size={30} className='text-[#ff4d2d]' />
        </button>
        <h1 className='text-xl sm:text-2xl font-bold text-gray-800'>Track Order</h1>
      </div>

      <div className='max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-orange-100 p-5 sm:p-6'>

        <h2 className='text-lg sm:text-xl font-bold text-[#ff4d2d] mb-3'>
          {data.shop?.name}
        </h2>

        <p className='text-sm sm:text-base text-gray-700 mb-1'>
          <span className='font-semibold'>Items:</span>{" "}
          {data.items?.map((i) => i.item?.name).join(", ")}
        </p>
        <p className='text-sm sm:text-base text-gray-700 mb-4'>
          <span className='font-semibold'>Subtotal:</span> {data.subtotal}
        </p>

        <p className='text-sm sm:text-base text-gray-700 mb-4'>
          <span className='font-semibold'>Delivery address:</span> {data.deliveryAddress?.text}
        </p>

        <p className='text-sm sm:text-base text-gray-700'>
          <span className='font-semibold'>Delivery Boy Name:</span> {data.deliveryBoy?.fullName}
        </p>
        <p className='text-sm sm:text-base text-gray-700 mb-4'>
          <span className='font-semibold'>Delivery Boy contact No.:</span> {data.deliveryBoy?.mobile}
        </p>

        <div className='w-full h-[300px] sm:h-[380px] rounded-lg overflow-hidden border border-gray-200'>
          {boyLocation?.latitude && customerLat
            ? (
              <MapContainer
                center={[boyLocation.latitude, boyLocation.longitude]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                <Marker position={[boyLocation.latitude, boyLocation.longitude]} />
                <Marker position={[customerLat, customerLon]} />
                {points.length === 2 &&
                  <Polyline positions={points} pathOptions={{ color: "#2563eb", weight: 4 }} />
                }
                <FitBounds points={points} />
              </MapContainer>
            )
            : (
              <div className='w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 text-sm'>
                Waiting for delivery partner's location...
              </div>
            )
          }
        </div>

      </div>

    </div>
  )
}

export default TrackOrder