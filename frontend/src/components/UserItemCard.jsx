import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { FiShoppingCart } from 'react-icons/fi'

const UserItemCard = ({ item }) => {
  const [quantity, setQuantity] = useState(0)

  const handleAdd = () => {
    setQuantity(prev => prev + 1)
  }

  const handleRemove = () => {
    if (quantity > 0) {
      setQuantity(prev => prev - 1)
    }
  }

  const handleAddToCart = () => {
    // cart me item add karne wala logic yahan aayega
    console.log("added to cart:", item.name, "qty:", quantity || 1)
  }

  const ratingValue = item?.rating?.average || 0
  const ratingCount = item?.rating?.count || 0

  return (
    <div className='bg-white rounded-2xl shadow-md border border-orange-100 overflow-hidden hover:shadow-lg transition-shadow duration-300'>
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
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={11}
              className={star <= Math.round(ratingValue) ? 'text-yellow-400' : 'text-yellow-200'}
            />
          ))}
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
                onClick={handleRemove}
                disabled={quantity === 0}
                className='w-6 h-6 sm:w-7 sm:h-7 flex items-center cursor-pointer justify-center rounded-full bg-[#ff4d2d] text-white font-bold text-sm sm:text-base hover:bg-orange-700 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed'
              >
                −
              </button>
              <span className='text-sm sm:text-base font-semibold text-gray-800 min-w-[20px] text-center'>
                {quantity}
              </span>
              <button
                onClick={handleAdd}
                className='w-6 h-6 sm:w-7 sm:h-7 flex items-center cursor-pointer justify-center rounded-full bg-[#ff4d2d] text-white font-bold text-sm sm:text-base hover:bg-orange-700 transition-colors duration-200'
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className='w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center cursor-pointer rounded-full bg-[#ff4d2d] text-white hover:bg-orange-700 transition-colors duration-200'
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