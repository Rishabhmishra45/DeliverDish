import React, { useState } from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import { FaUtensils, FaPen, FaPlus } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import OwnerItemCard from './OwnerItemCard'
import { ClipLoader } from 'react-spinners'
import { categories } from '../category'

function OwnerDashboard() {
  const { myShopData, loading } = useSelector(state => state.owner)
  const { searchText } = useSelector(state => state.search)
  const navigate = useNavigate()

  const [categoryFilter, setCategoryFilter] = useState("All")
  const [foodTypeFilter, setFoodTypeFilter] = useState("all")

  const allItems = myShopData?.items || []

  const filteredItems = allItems.filter((item) => {

    const matchesSearch = searchText
      ? item.name?.toLowerCase().includes(searchText.toLowerCase())
      : true

    const matchesCategory = categoryFilter === "All"
      ? true
      : item.category === categoryFilter

    const matchesFoodType = foodTypeFilter === "all"
      ? true
      : item.foodType === foodTypeFilter

    return matchesSearch && matchesCategory && matchesFoodType
  })

  const hasActiveFilters = searchText || categoryFilter !== "All" || foodTypeFilter !== "all"

  const clearFilters = () => {
    setCategoryFilter("All")
    setFoodTypeFilter("all")
  }

  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex flex-col items-center'>
      <Nav />

      {/* Loading */}
      {/* {loading ? (
        <div className="flex justify-center items-center h-[80vh]">
          <ClipLoader
            color="#ff4d2d"
            loading={loading}
            size={40}
          />
        </div>
      ) : ( */}
      <>
        {!myShopData &&
          <div className='w-full flex justify-center items-center p-4 sm:p-6 mt-[70px]'>
            <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-5 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300'>
              <div className='flex flex-col items-center text-center'>
                <FaUtensils className='text-[#ff4d2d] w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-4' />
                <h2 className='text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2'>
                  Add Your Restaurant
                </h2>
                <p className='text-gray-600 mb-4 text-xs sm:text-sm md:text-base'>
                  Join our food delivery platform and reach thousands of hungry customers every day.
                </p>
                <button
                  className='bg-[#ff4d2d] text-white cursor-pointer px-5 sm:px-6 py-2 rounded-full font-medium text-sm sm:text-base shadow-md hover:bg-orange-600 transition-colors duration-200'
                  onClick={() => navigate("/create-edit-shop")}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        }

        {myShopData &&
          <div className='w-full flex flex-col items-center gap-5 sm:gap-6 px-3 sm:px-6 mt-[100px] mb-10'>

            <div className='flex items-center gap-2 text-center'>
              <FaUtensils className='text-[#ff4d2d] w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex-shrink-0' />
              <h2 className='text-lg sm:text-xl md:text-2xl font-bold text-gray-800'>
                Welcome to {myShopData.name}
              </h2>
            </div>

            <div className='w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden'>
              <div className='relative w-full h-44 sm:h-56 md:h-64'>
                <img
                  src={myShopData.image}
                  alt={myShopData.name}
                  className='w-full h-full object-cover'
                />

                <div
                  className='absolute top-3 right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#ff4d2d] flex items-center justify-center shadow-md cursor-pointer hover:bg-orange-600 transition-colors duration-200'
                  onClick={() => navigate("/create-edit-shop")}
                >
                  <FaPen className='text-white w-3.5 h-3.5 sm:w-4 sm:h-4' />
                </div>
              </div>

              <div className='p-4 sm:p-5'>
                <h3 className='text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1'>
                  {myShopData.name}
                </h3>

                <p className='text-gray-500 text-xs sm:text-sm md:text-base'>
                  {myShopData.city}, {myShopData.state}
                </p>

                <p className='text-gray-500 text-xs sm:text-sm md:text-base'>
                  {myShopData.address}
                </p>
              </div>
            </div>

            {(!allItems || allItems.length === 0) &&
              <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-5 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300'>
                <div className='flex flex-col items-center text-center'>
                  <FaUtensils className='text-[#ff4d2d] w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-4' />

                  <h2 className='text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2'>
                    Add Your Food Item
                  </h2>

                  <p className='text-gray-600 mb-4 text-xs sm:text-sm md:text-base'>
                    Share your delicious creations with our customers by adding them to the menu.
                  </p>

                  <button
                    className='bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium text-sm sm:text-base shadow-md hover:bg-orange-600 transition-colors duration-200'
                    onClick={() => navigate("/add-food")}
                  >
                    Add Food
                  </button>
                </div>
              </div>
            }

            {allItems && allItems.length > 0 &&
              <div className='w-full max-w-4xl'>

                <div className='flex items-center justify-between mb-4 flex-wrap gap-3'>
                  <h3 className='text-base sm:text-lg md:text-xl font-bold text-gray-800'>
                    Food Items
                  </h3>

                  <button
                    className='flex items-center gap-1.5 sm:gap-2 bg-[#ff4d2d] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm shadow-md hover:bg-orange-600 transition-colors duration-200'
                    onClick={() => navigate("/add-food")}
                  >
                    <FaPlus size={11} />
                    Add Item
                  </button>
                </div>

                {/* Filters */}
                <div className='flex flex-wrap items-center gap-2 sm:gap-3 mb-5'>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className='px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-300 text-xs sm:text-sm text-gray-700 outline-none focus:border-[#ff4d2d] bg-white cursor-pointer max-w-[140px] sm:max-w-none'
                  >
                    <option value="All">All Categories</option>
                    {categories
                      .filter((c) => c.category !== "All")
                      .map((c) => (
                        <option key={c.category} value={c.category}>{c.category}</option>
                      ))
                    }
                  </select>

                  <div className='flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1'>
                    <button
                      onClick={() => setFoodTypeFilter("all")}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${foodTypeFilter === "all" ? "bg-[#ff4d2d] text-white" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFoodTypeFilter("veg")}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${foodTypeFilter === "veg" ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      Veg
                    </button>
                    <button
                      onClick={() => setFoodTypeFilter("non veg")}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${foodTypeFilter === "non veg" ? "bg-red-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      Non Veg
                    </button>
                  </div>

                  {hasActiveFilters &&
                    <button
                      onClick={clearFilters}
                      className='text-xs sm:text-sm text-[#ff4d2d] font-medium hover:underline'
                    >
                      Clear filters
                    </button>
                  }

                  <p className='text-xs sm:text-sm text-gray-400 ml-auto'>
                    {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
                  </p>

                </div>

                {filteredItems.length === 0
                  ? (
                    <p className='text-gray-500 text-sm text-center py-8'>
                      No items match your filters.
                    </p>
                  )
                  : (
                    <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5'>
                      {filteredItems.map((item) => (
                        <OwnerItemCard key={item._id} item={item} />
                      ))}
                    </div>
                  )
                }

              </div>
            }

          </div>
        }
      </>
      {/* )} */}
    </div>
  )
}

export default OwnerDashboard