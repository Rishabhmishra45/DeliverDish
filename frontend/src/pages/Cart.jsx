import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowRoundBack } from 'react-icons/io'
import Nav from '../components/Nav'
import CartItemCard from '../components/CartItemCard'
import Toast from '../components/Toast'
import useToast from '../hooks/useToast'

const Cart = () => {

  const navigate = useNavigate()
  const { cartItems } = useSelector(state => state.cart)
  const { toast, triggerToast } = useToast()

  const totalPrice = cartItems?.reduce(
    (total, c) => total + (c.item?.price || 0) * c.quantity, 0
  ) || 0

  const handleRemoveNotify = (name) => {
    triggerToast(`${name} removed from cart`, "error")
  }

  return (
    <div className='min-h-screen bg-[#fff9f6]'>
      <Nav />
      <Toast toast={toast} />

      <div className='pt-[90px] px-4 sm:px-6 pb-10 max-w-3xl mx-auto'>

        <div className='flex items-center gap-3 mb-6'>
          <button onClick={() => navigate(-1)} className='cursor-pointer'>
            <IoIosArrowRoundBack size={30} className='text-[#ff4d2d]' />
          </button>
          <h1 className='text-xl sm:text-2xl font-bold text-gray-800'>My Cart</h1>
        </div>

        {(!cartItems || cartItems.length === 0)
          ? (
            <p className='text-gray-500 text-center mt-10'>
              Your cart is empty.
            </p>
          )
          : (
            <>
              <div className='flex flex-col gap-3 sm:gap-4'>
                {cartItems.map((c) => (
                  <CartItemCard
                    key={c.item._id}
                    cartEntry={c}
                    onRemove={handleRemoveNotify}
                  />
                ))}
              </div>

              <div className='mt-6 bg-white rounded-xl shadow-md border border-orange-100 p-4 sm:p-5 flex items-center justify-between'>
                <p className='text-base sm:text-lg font-semibold text-gray-800'>Total</p>
                <p className='text-lg sm:text-xl font-bold text-[#ff4d2d]'>₹{totalPrice}</p>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className='w-full mt-4 bg-[#ff4d2d] text-white py-3 rounded-full font-semibold shadow-md hover:bg-orange-600 transition-colors duration-200'
              >
                Proceed to Checkout
              </button>
            </>
          )
        }

      </div>
    </div>
  )
}

export default Cart