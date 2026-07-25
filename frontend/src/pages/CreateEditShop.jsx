import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaUtensils } from 'react-icons/fa'
import { IoIosArrowRoundBack } from 'react-icons/io'
import axios from 'axios'
import { serverUrl } from '../App'
import { setMyShopData } from '../redux/ownerSlice'

const CreateEditShop = () => {

  const { myShopData } = useSelector(state => state.owner)
  const { city: reduxCity, state: reduxState, address: reduxAddress } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [name, setName] = useState(myShopData?.name || "")
  const [address, setAddress] = useState(myShopData?.address || reduxAddress || "")
  const [city, setCity] = useState(myShopData?.city || reduxCity || "")
  const [state, setState] = useState(myShopData?.state || reduxState || "")
  const [coords, setCoords] = useState({
    latitude: myShopData?.latitude || null,
    longitude: myShopData?.longitude || null
  })
  const [frontendImage, setFrontendImage] = useState(myShopData?.image || null)
  const [backendImage, setBackendImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      setBackendImage(file)
      setFrontendImage(URL.createObjectURL(file))
    }
  }

  // City/State/Address turant Redux se mil jaate hain (useGetCity hook App.jsx me
  // pehle hi fetch kar ke localStorage + Redux me daal chuka hota hai)
  useEffect(() => {
    if (myShopData) return

    if (reduxCity && !city) setCity(reduxCity)
    if (reduxState && !state) setState(reduxState)
    if (reduxAddress && !address) setAddress(reduxAddress)
  }, [reduxCity, reduxState, reduxAddress])

  // shop ka exact lat/long capture karte hain — delivery boy matching (distance-based) iske liye zaroori hai
  useEffect(() => {
    if (myShopData?.latitude && myShopData?.longitude) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      (error) => {
        console.log(error)
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 1000 * 60 * 30
      }
    )
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()

    setLoading(true)

    try {

      const formData = new FormData()
      formData.append("name", name)
      formData.append("city", city)
      formData.append("state", state)
      formData.append("address", address)
      if (coords.latitude) formData.append("latitude", coords.latitude)
      if (coords.longitude) formData.append("longitude", coords.longitude)
      if (backendImage) {
        formData.append("image", backendImage)
      }

      const result = await axios.post(
        `${serverUrl}/api/shop/create-edit`,
        formData,
        { withCredentials: true }
      )

      dispatch(setMyShopData(result.data))
      navigate("/")

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex items-center justify-center p-4 relative'>

      <div
        className='absolute top-[20px] left-[20px] z-[10] cursor-pointer'
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
      </div>

      <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-orange-100'>

        <div className='flex flex-col items-center mb-4'>
          <div className='w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-2'>
            <FaUtensils className='text-[#ff4d2d] w-8 h-8' />
          </div>
          <h2 className='text-2xl font-bold text-gray-800'>
            {myShopData ? "Edit Shop" : "Add Shop"}
          </h2>
        </div>

        <form onSubmit={handleSave} className='space-y-4'>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
            <input
              type="text"
              placeholder='Enter Shop Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#ff4d2d]'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Shop Image</label>
            <input
              type="file"
              accept='image/*'
              onChange={handleImage}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm'
            />
            {frontendImage &&
              <div className='w-full h-40 mt-3 rounded-xl overflow-hidden border-2 border-orange-200 bg-gray-50'>
                <img
                  src={frontendImage}
                  alt="shop"
                  className='w-full h-full object-cover'
                />
              </div>
            }
          </div>

          <div className='flex gap-3'>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>City</label>
              <input
                type="text"
                placeholder='City'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#ff4d2d]'
                required
              />
            </div>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>State</label>
              <input
                type="text"
                placeholder='State'
                value={state}
                onChange={(e) => setState(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#ff4d2d]'
                required
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
            <input
              type="text"
              placeholder='Enter Shop Address'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#ff4d2d]'
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-[#ff4d2d] text-white py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200 disabled:opacity-60'
          >
            {loading ? "Saving..." : "Save"}
          </button>

        </form>

      </div>

    </div>
  )
}

export default CreateEditShop