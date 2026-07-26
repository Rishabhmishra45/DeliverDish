import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaStar, FaRegStar } from 'react-icons/fa'
import { FiShoppingCart } from 'react-icons/fi'
import axios from 'axios'
import { serverUrl } from '../App'
import { setCartItems } from '../redux/cartSlice'
import useToast from '../hooks/useToast'
import Toast from './Toast'

const UserItemCard = ({ item }) => {

  const dispatch = useDispatch()
  const { cartItems } = useSelector(state => state.cart)
  const { toast, triggerToast } = useToast()

  const cartEntry = cartItems?.find((c) => c.item?._id === item._id)

  // local quantity — jab tak cart icon pe click na ho, ye backend me commit nahi hoga
  const [localQty, setLocalQty] = useState(cartEntry?.quantity || 0)

  // jab backend se commit ho jaaye (cartEntry.quantity change ho), tab local ko sync karo
  useEffect(() => {
    setLocalQty(cartEntry?.quantity || 0)
  }, [cartEntry?.quantity])

  const handleIncrease = () => {
    setLocalQty((prev) => prev + 1)
  }

  const handleDecrease = () => {
    setLocalQty((prev) => (prev > 0 ? prev - 1 : 0))
  }

  const handleAddToCart = async () => {
    if (localQty === 0) return

    try {

      const result = await axios.post(
        `${serverUrl}/api/cart/update-cart`,
        { itemId: item._id, quantity: localQty },
        { withCredentials: true }
      )

      dispatch(setCartItems(result.data.cart))
      triggerToast("Added to cart", "success")

    } catch (error) {
      console.log(error)
    }
  }

  const ratingValue = item?.rating?.average || 0
  const ratingCount = item?.rating?.count || 0

  return (
    <div className='bg-white rounded-2xl shadow-md border border-orange-100 overflow-hidden hover:shadow-lg transition-shadow duration-300'>

      <Toast toast={toast} />

      <div className='relative w-full h-40'>
        <img
          src={item.image}
          alt={item.name}
          className='w-full h-full object-cover'
        />
        {/* Veg/Non-Veg Badge */}
        <div
          className={`absolute top-2 left-2 w-5 h-5 rounded flex items-center justify-center border-2 bg-white ${
            item.foodType === "veg" ? "border-green-600" : "border-red-600"
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${
            item.foodType === "veg" ? "bg-green-600" : "bg-red-600"
          }`}></span>
        </div>
      </div>

      <div className='p-3 sm:p-4'>
        {/* Item Name */}
        <h4 className='text-sm sm:text-base font-bold text-gray-800 truncate'>
          {item.name}
        </h4>

        {/* Rating */}
        <div className='flex items-center gap-1 my-1'>
          {[1, 2, 3, 4, 5].map((star) =>
            star <= Math.round(ratingValue)
              ? <FaStar key={star} size={15} className='text-yellow-400' />
              : <FaRegStar key={star} size={15} className='text-yellow-400' />
          )}
          <span className='text-[10px] sm:text-xs text-gray-500 ml-1'>
            ({ratingCount})
          </span>
        </div>

        {/* Price and Quantity Controls */}
        <div className='flex items-center justify-between mt-2'>
          <p className='text-[#ff4d2d] font-semibold text-sm sm:text-base'>
            ₹{item.price}
          </p>

          <div className='flex items-center gap-1.5 sm:gap-2'>
            <div className='flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-full px-2 sm:px-3 py-1 border border-gray-200'>
              <button
                onClick={handleDecrease}
                disabled={localQty === 0}
                className='w-6 h-6 sm:w-7 sm:h-7 flex items-center cursor-pointer justify-center rounded-full bg-[#ff4d2d] text-white font-bold text-sm sm:text-base hover:bg-orange-700 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed'
              >
                −
              </button>
              <span className='text-sm sm:text-base font-semibold text-gray-800 min-w-[20px] text-center'>
                {localQty}
              </span>
              <button
                onClick={handleIncrease}
                className='w-6 h-6 sm:w-7 sm:h-7 flex items-center cursor-pointer justify-center rounded-full bg-[#ff4d2d] text-white font-bold text-sm sm:text-base hover:bg-orange-700 transition-colors duration-200'
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={localQty === 0}
              className='w-7 h-7 sm:w-8 sm:h-8 flex items-center cursor-pointer justify-center rounded-full bg-[#ff4d2d] text-white hover:bg-orange-700 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed'
            >
              <FiShoppingCart size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserItemCard