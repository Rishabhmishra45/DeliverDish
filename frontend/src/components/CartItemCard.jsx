import React from 'react'
import { useDispatch } from 'react-redux'
import { FaTrash } from 'react-icons/fa'
import axios from 'axios'
import { serverUrl } from '../App'
import { setCartItems } from '../redux/cartSlice'

const CartItemCard = ({ cartEntry, onRemove }) => {

  const dispatch = useDispatch()
  const item = cartEntry.item
  const quantity = cartEntry.quantity
  const itemTotal = item.price * quantity

  const updateCart = async (newQuantity) => {
    try {

      const result = await axios.post(
        `${serverUrl}/api/cart/update-cart`,
        { itemId: item._id, quantity: newQuantity },
        { withCredentials: true }
      )

      dispatch(setCartItems(result.data.cart))

    } catch (error) {
      console.log(error)
    }
  }

  const handleIncrease = () => {
    updateCart(quantity + 1)
  }

  const handleDecrease = () => {
    if (quantity > 1) {
      updateCart(quantity - 1)
    } else {
      handleDelete()
    }
  }

  const handleDelete = () => {
    updateCart(0)
    onRemove(item.name)
  }

  return (
    <div className='flex items-center gap-3 sm:gap-4 bg-white rounded-xl shadow-sm border border-orange-100 p-3 sm:p-4'>

      <img
        src={item.image}
        alt={item.name}
        className='w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0'
      />

      <div className='flex-1 min-w-0'>
        <h4 className='text-sm sm:text-base font-semibold text-gray-800 truncate'>
          {item.name}
        </h4>
        <p className='text-gray-500 text-xs sm:text-sm mt-1'>
          ₹{item.price} x {quantity}
        </p>
        <p className='text-[#ff4d2d] font-bold text-sm sm:text-base mt-0.5'>
          ₹{itemTotal}
        </p>
      </div>

      <div className='flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-full px-2 sm:px-3 py-1 border border-gray-200 flex-shrink-0'>
        <button
          onClick={handleDecrease}
          className='w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-[#ff4d2d] text-white font-bold text-sm sm:text-base hover:bg-orange-700 transition-colors duration-200'
        >
          −
        </button>
        <span className='text-sm sm:text-base font-semibold text-gray-800 min-w-[20px] text-center'>
          {quantity}
        </span>
        <button
          onClick={handleIncrease}
          className='w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-[#ff4d2d] text-white font-bold text-sm sm:text-base hover:bg-orange-700 transition-colors duration-200'
        >
          +
        </button>
      </div>

      <button
        onClick={handleDelete}
        className='w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors duration-200 flex-shrink-0'
      >
        <FaTrash size={14} />
      </button>

    </div>
  )
}

export default CartItemCard