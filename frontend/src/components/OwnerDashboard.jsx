import React from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import { FaUtensils, FaPen, FaPlus } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import OwnerItemCard from './OwnerItemCard'
import { ClipLoader } from 'react-spinners'

function OwnerDashboard() {
  const { myShopData, loading } = useSelector(state => state.owner)
  const navigate = useNavigate()

  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex flex-col items-center'>
      <Nav />

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-[80vh]">
          <ClipLoader
            color="#ff4d2d"
            loading={loading}
            size={40}
          />
        </div>
      ) : (
        <>
          {!myShopData &&
            <div className='flex justify-center items-center p-4 sm:p-6 mt-[70px]'>
              <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300'>
                <div className='flex flex-col items-center text-center'>
                  <FaUtensils className='text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4' />
                  <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>
                    Add Your Restaurant
                  </h2>
                  <p className='text-gray-600 mb-4 text-sm sm:text-base'>
                    Join our food delivery platform and reach thousands of hungry customers every day.
                  </p>
                  <button
                    className='bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200'
                    onClick={() => navigate("/create-edit-shop")}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          }

          {myShopData &&
            <div className='w-full flex flex-col items-center gap-6 px-4 sm:px-6 mt-[10px] mb-10'>

              <div className='flex items-center gap-2'>
                <FaUtensils className='text-[#ff4d2d] w-6 h-6 sm:w-7 sm:h-7' />
                <h2 className='text-xl sm:text-2xl font-bold text-gray-800'>
                  Welcome to {myShopData.name}
                </h2>
              </div>

              <div className='w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden'>
                <div className='relative w-full h-56 sm:h-64'>
                  <img
                    src={myShopData.image}
                    alt={myShopData.name}
                    className='w-full h-full object-cover'
                  />

                  <div
                    className='absolute top-3 right-3 w-9 h-9 rounded-full bg-[#ff4d2d] flex items-center justify-center shadow-md cursor-pointer hover:bg-orange-600 transition-colors duration-200'
                    onClick={() => navigate("/create-edit-shop")}
                  >
                    <FaPen className='text-white w-4 h-4' />
                  </div>
                </div>

                <div className='p-5'>
                  <h3 className='text-lg sm:text-xl font-bold text-gray-800 mb-1'>
                    {myShopData.name}
                  </h3>

                  <p className='text-gray-500 text-sm sm:text-base'>
                    {myShopData.city}, {myShopData.state}
                  </p>

                  <p className='text-gray-500 text-sm sm:text-base'>
                    {myShopData.address}
                  </p>
                </div>
              </div>

              {(!myShopData.items || myShopData.items.length === 0) &&
                <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300'>
                  <div className='flex flex-col items-center text-center'>
                    <FaUtensils className='text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4' />

                    <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>
                      Add Your Food Item
                    </h2>

                    <p className='text-gray-600 mb-4 text-sm sm:text-base'>
                      Share your delicious creations with our customers by adding them to the menu.
                    </p>

                    <button
                      className='bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200'
                      onClick={() => navigate("/add-food")}
                    >
                      Add Food
                    </button>
                  </div>
                </div>
              }

              {myShopData.items && myShopData.items.length > 0 &&
                <div className='w-full max-w-4xl'>

                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-lg sm:text-xl font-bold text-gray-800'>
                      Food Items
                    </h3>

                    <button
                      className='flex items-center gap-2 bg-[#ff4d2d] text-white px-4 py-2 rounded-full font-medium text-sm shadow-md hover:bg-orange-600 transition-colors duration-200'
                      onClick={() => navigate("/add-food")}
                    >
                      <FaPlus size={12} />
                      Add Item
                    </button>
                  </div>

                  <div className='grid grid-cols-2 lg:grid-cols-3 gap-5'>
                    {myShopData.items.map((item) => (
                      <OwnerItemCard key={item._id} item={item} />
                    ))}
                  </div>

                </div>
              }

            </div>
          }
        </>
      )}
    </div>
  )
}

export default OwnerDashboard