import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import Nav from './Nav'
import { categories } from '../category'
import CategoryCard from './CategoryCard'
import UserShopCard from './UserShopCard'

function UserDashboard() {

    const { city } = useSelector(state => state.user)
    const { shopsInMyCity } = useSelector(state => state.city)

    const categoryScrollRef = useRef()

    const scrollCategory = (direction) => {
        if (categoryScrollRef.current) {
            const scrollAmount = 300
            categoryScrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            })
        }
    }

    return (
        <div className='min-h-screen bg-[#fff9f6]'>
            <Nav />

            <div className='pt-[10px] px-4 sm:px-6 pb-10 max-w-7xl mx-auto flex flex-col gap-8'>

                {/* Inspiration for your first order */}
                <div className='relative'>
                    <h2 className='text-lg sm:text-xl font-semibold text-gray-800 mb-3'>
                        Inspiration for your first order
                    </h2>

                    <button
                        onClick={() => scrollCategory("left")}
                        className='hidden sm:flex absolute cursor-pointer left-[-3px] top-[95px] z-10 w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 items-center justify-center hover:bg-gray-50'
                    >
                        <FaChevronLeft size={12} className='text-gray-600' />
                    </button>

                    <div
                        ref={categoryScrollRef}
                        className='flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-hide'
                    >
                        {categories.map((cat, index) => (
                            <CategoryCard
                                key={index}
                                category={cat.category}
                                image={cat.image}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => scrollCategory("right")}
                        className='hidden sm:flex absolute cursor-pointer right-[-3px] top-[95px] z-10 w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 items-center justify-center hover:bg-gray-50'
                    >
                        <FaChevronRight size={12} className='text-gray-600' />
                    </button>
                </div>

                {/* Best shops in city */}
                <div>
                    <h2 className='text-lg sm:text-xl font-semibold text-gray-800 mb-3'>
                        Best shops in {city || "your city"}
                    </h2>

                    {shopsInMyCity.length === 0
                        ? (
                            <p className='text-gray-500 text-sm'>
                                No shops found in your city yet.
                            </p>
                        )
                        : (
                            <div className='flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide'>
                                {shopsInMyCity.map((shop) => (
                                    <UserShopCard key={shop._id} shop={shop} />
                                ))}
                            </div>
                        )
                    }
                </div>

            </div>

        </div>
    )
}

export default UserDashboard