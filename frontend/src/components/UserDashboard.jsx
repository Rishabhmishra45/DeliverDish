import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import Nav from './Nav'
import { categories } from '../category'
import CategoryCard from './CategoryCard'
import UserShopCard from './UserShopCard'
import UserItemCard from './UserItemCard'
import Footer from './Footer'

function UserDashboard() {

    const { city } = useSelector(state => state.user)
    const { shopsInMyCity } = useSelector(state => state.city)
    const { searchText } = useSelector(state => state.search)

    const categoryScrollRef = useRef(null)

    const [showLeft, setShowLeft] = useState(false)
    const [showRight, setShowRight] = useState(false)
    const [showAllItems, setShowAllItems] = useState(false)

    const scrollCategory = (direction) => {
        if (!categoryScrollRef.current) return

        categoryScrollRef.current.scrollBy({
            left: direction === "left" ? -300 : 300,
            behavior: "smooth"
        })
    }

    const checkScrollPosition = () => {
        const container = categoryScrollRef.current

        if (!container) return

        setShowLeft(container.scrollLeft > 5)

        setShowRight(
            container.scrollLeft < container.scrollWidth - container.clientWidth - 5
        )
    }

    useEffect(() => {
        const container = categoryScrollRef.current

        if (!container) return

        checkScrollPosition()

        const timer = setTimeout(checkScrollPosition, 300)

        container.addEventListener("scroll", checkScrollPosition)
        window.addEventListener("resize", checkScrollPosition)

        return () => {
            clearTimeout(timer)
            container.removeEventListener("scroll", checkScrollPosition)
            window.removeEventListener("resize", checkScrollPosition)
        }
    }, [])

    const suggestedItems =
        shopsInMyCity?.flatMap(shop => shop.items || []) || []

    // search text se items name/category ke basis pe filter kiya
    const filteredItems = searchText
        ? suggestedItems.filter((item) =>
            item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            item.category?.toLowerCase().includes(searchText.toLowerCase())
        )
        : suggestedItems

    // shops ko bhi search text se filter kiya (naam ke basis pe)
    const filteredShops = searchText
        ? shopsInMyCity.filter((shop) =>
            shop.name?.toLowerCase().includes(searchText.toLowerCase())
        )
        : shopsInMyCity

    const visibleItems = showAllItems
        ? filteredItems
        : filteredItems.slice(0, 12)

    return (
        <div className='min-h-screen bg-[#fff9f6]'>

            <Nav />

            <div className='pt-[90px] px-4 sm:px-6 pb-10 max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8'>

                {!searchText &&
                    <div className='relative'>

                        <h2 className='text-lg sm:text-xl font-semibold text-gray-800 mb-3'>
                            Inspiration for your first order
                        </h2>

                        {showLeft && (
                            <button
                                onClick={() => scrollCategory("left")}
                                className='hidden sm:flex absolute left-0 top-[95px] z-30
                                w-11 h-11 rounded-full bg-white shadow-xl border
                                items-center justify-center cursor-pointer
                                hover:bg-[#ff4d2d] hover:text-white
                                hover:scale-110 transition-all duration-300'
                            >
                                <FaChevronLeft size={15} />
                            </button>
                        )}

                        <div
                            ref={categoryScrollRef}
                            className='flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-2'
                        >
                            {categories.map((cat, index) => (
                                <CategoryCard
                                    key={index}
                                    category={cat.category}
                                    image={cat.image}
                                />
                            ))}
                        </div>

                        {showRight && (
                            <button
                                onClick={() => scrollCategory("right")}
                                className='hidden sm:flex absolute right-0 top-[95px] z-30
                                w-11 h-11 rounded-full bg-white shadow-xl border
                                items-center justify-center cursor-pointer
                                hover:bg-[#ff4d2d] hover:text-white
                                hover:scale-110 transition-all duration-300'
                            >
                                <FaChevronRight size={15} />
                            </button>
                        )}

                    </div>
                }

                {/* Best Shops */}

                <div>

                    <h2 className='text-lg sm:text-xl font-semibold text-gray-800 mb-3'>
                        {searchText ? "Matching shops" : `Best shops in ${city || "your city"}`}
                    </h2>

                    {filteredShops.length === 0 ? (

                        <p className='text-gray-500'>
                            {searchText ? "No shops match your search." : "No shops found in your city yet."}
                        </p>

                    ) : (

                        <div className='flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2'>
                            {filteredShops.map(shop => (
                                <UserShopCard
                                    key={shop._id}
                                    shop={shop}
                                />
                            ))}
                        </div>

                    )}

                </div>

                {/* Suggested Items */}

                <div>

                    <h2 className='text-lg sm:text-xl font-semibold text-gray-800 mb-4'>
                        {searchText ? "Matching items" : "Suggested items"}
                    </h2>

                    {filteredItems.length === 0 ? (

                        <p className='text-gray-500'>
                            {searchText ? "No items match your search." : "No items available in your city yet."}
                        </p>

                    ) : (

                        <>
                            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5'>

                                {visibleItems.map(item => (

                                    <UserItemCard
                                        key={item._id}
                                        item={item}
                                    />

                                ))}

                            </div>

                            {filteredItems.length > 12 && (

                                <div className='flex justify-center mt-8'>

                                    <button
                                        onClick={() => setShowAllItems(!showAllItems)}
                                        className='px-6 sm:px-8 py-2.5 sm:py-3 rounded-full
                                        bg-[#ff4d2d] text-white
                                        text-sm sm:text-base
                                        font-semibold
                                        shadow-lg
                                        cursor-pointer
                                        hover:bg-orange-600
                                        hover:scale-105
                                        active:scale-95
                                        transition-all duration-300'
                                    >
                                        {showAllItems
                                            ? "Show Less ↑"
                                            : "Show More ↓"}
                                    </button>

                                </div>

                            )}

                        </>

                    )}

                </div>

            </div>
            <Footer />
        </div>
    )
}

export default UserDashboard