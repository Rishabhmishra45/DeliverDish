import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { serverUrl } from '../App'
import UserItemCard from '../components/UserItemCard'

const ShopDetails = () => {

  const { shopId } = useParams()
  const navigate = useNavigate()

  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchShop = async () => {
      setLoading(true)
      try {

        const result = await axios.get(
          `${serverUrl}/api/shop/get-shop-by-id/${shopId}`,
          { withCredentials: true }
        )

        setShop(result.data)

      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchShop()

  }, [shopId])

  if (loading) {
    return (
      <div className='w-full min-h-screen flex items-center justify-center bg-[#fff9f6]'>
        <div className='w-10 h-10 border-4 border-[#ff4d2d] border-t-transparent rounded-full animate-spin'></div>
      </div>
    )
  }

  if (!shop) {
    return (
      <div className='w-full min-h-screen flex items-center justify-center bg-[#fff9f6]'>
        <p className='text-gray-600'>Shop not found</p>
      </div>
    )
  }

  return (
    <div className='w-full min-h-screen bg-[#fff9f6] pb-10'>

      <div className='relative w-full h-52 sm:h-64 md:h-72'>
        <img
          src={shop.image}
          alt={shop.name}
          className='w-full h-full object-cover'
        />
        <div
          className='absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md cursor-pointer'
          onClick={() => navigate("/")}
        >
          <IoIosArrowRoundBack size={26} className='text-[#ff4d2d]' />
        </div>
      </div>

      <div className='max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-10'>
        <div className='bg-white rounded-2xl shadow-lg border border-orange-100 p-5'>
          <h1 className='text-xl sm:text-2xl font-bold text-gray-800 mb-1'>
            {shop.name}
          </h1>
          <p className='text-gray-500 text-sm sm:text-base'>
            {shop.city}, {shop.state}
          </p>
          <p className='text-gray-500 text-sm sm:text-base'>
            {shop.address}
          </p>
        </div>
      </div>

      <div className='max-w-5xl mx-auto px-4 sm:px-6 mt-8'>
        <h2 className='text-lg sm:text-xl font-semibold text-gray-800 mb-4'>
          Menu
        </h2>

        {(!shop.items || shop.items.length === 0)
          ? (
            <p className='text-gray-500 text-sm'>
              No items available yet.
            </p>
          )
          : (
            <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'>
              {shop.items.map((item) => (
                <UserItemCard key={item._id} item={item} />
              ))}
            </div>
          )
        }
      </div>

    </div>
  )
}

export default ShopDetails