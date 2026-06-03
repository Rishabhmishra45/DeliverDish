import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { FaLocationDot } from "react-icons/fa6"
import { IoIosSearch } from "react-icons/io"
import { FiShoppingCart } from "react-icons/fi"
import { MdClose } from "react-icons/md"
import axios from 'axios'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'

function Nav() {

    const { userData, city } = useSelector(state => state.user)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const dispatch = useDispatch()
    const isOwner = userData?.role === "owner"

    const handleLogOut = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/signout`,
                { withCredentials: true }
            )
            dispatch(setUserData(null))
        } catch (error) {
            console.log(error)
        }
    }

    const profileRef = useRef()

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <>
            {/* Navbar Container */}
            <div className='w-full h-[70px] fixed top-0 left-0 z-[9999] bg-[#fff9f6] flex items-center justify-center px-3 sm:px-4 shadow-sm'>

                {/* Navbar Inner */}
                <div className='w-full max-w-7xl flex items-center justify-between gap-2 sm:gap-4'>

                    {/* Logo */}
                    <h1 className='text-xl sm:text-2xl md:text-3xl font-bold text-[#ff4d2d] whitespace-nowrap cursor-pointer'>
                        DeliverDish
                    </h1>

                    {/* Search Section - Desktop */}
                    <div className='hidden md:flex items-center flex-1 max-w-3xl h-[50px] bg-white shadow-md rounded-lg'>

                        {/* Location */}
                        <div className='flex items-center w-[200px] gap-2 px-3 border-r border-gray-300'>
                            <FaLocationDot size={18} className='text-[#ff4d2d]' />
                            <span className='truncate text-gray-600'>{city}</span>
                        </div>

                        {/* Search Input */}
                        <div className='flex items-center flex-1 px-3 gap-2'>
                            <IoIosSearch size={20} className='text-[#ff4d2d]' />
                            <input
                                type="text"
                                placeholder='Search delicious food...'
                                className='w-full outline-none text-gray-700'
                            />
                        </div>

                    </div>

                    {/* Right Section */}
                    <div className='flex items-center gap-2 sm:gap-4'>

                        {/* Mobile Location */}
                        <div className='flex items-center gap-2 md:hidden'>
                            <FaLocationDot size={18} className='text-[#ff4d2d]' />
                            <span className='text-sm text-gray-600'>{city}</span>
                        </div>

                        {/* Mobile Search Button */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className='md:hidden'
                        >
                            <IoIosSearch size={22} className='text-[#ff4d2d]' />
                        </button>

                        {/* Cart Icon */}
                        <div className='relative cursor-pointer'>
                            <FiShoppingCart size={22} className='text-[#ff4d2d]' />
                            <span className='absolute -top-2 -right-2 text-xs font-bold text-[#ff4d2d] bg-white rounded-full px-1 min-w-[18px] text-center'>
                                0
                            </span>
                        </div>

                        {/* My Orders Button */}
                        <button className='hidden sm:block px-3 py-1.5 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium hover:bg-[#ff4d2d]/20 transition'>
                            My Orders
                        </button>

                        {/* User Avatar */}
                        <div className='relative' ref={profileRef}>
                            <div
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className='w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-sm sm:text-base shadow-md font-semibold cursor-pointer'
                            >
                                {userData?.fullName?.charAt(0)?.toUpperCase() || "U"}
                            </div>

                            {isProfileOpen && (
                                <div className='absolute right-0 top-[56px] w-[220px] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-[99999]'>

                                    <div className='px-4 py-3 border-b border-gray-100'>
                                        <p className='text-sm font-semibold text-gray-800'>
                                            {userData?.fullName}
                                        </p>
                                    </div>

                                    <button className='md:hidden w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50'>
                                        My Orders
                                    </button>

                                    <button className='w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50'
                                        onClick={handleLogOut}>
                                        Logout
                                    </button>

                                </div>
                            )}
                        </div>

                    </div>

                </div>

            </div>

            {/* Mobile Search Modal */}
            {isSearchOpen && (
                <div className='fixed inset-0 z-[10000] bg-white md:hidden'>

                    {/* Modal Header */}
                    <div className='flex items-center gap-3 p-4 border-b border-gray-200'>
                        <button onClick={() => setIsSearchOpen(false)}>
                            <MdClose size={24} className='text-gray-600' />
                        </button>
                        <div className='flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2'>
                            <IoIosSearch size={20} className='text-[#ff4d2d]' />
                            <input
                                type="text"
                                placeholder='Search for food...'
                                className='flex-1 outline-none bg-transparent'
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Modal Location */}
                    <div className='flex items-center gap-2 p-4 border-b border-gray-100 bg-gray-50'>
                        <FaLocationDot size={18} className='text-[#ff4d2d]' />
                        <span className='text-gray-700'>{city}</span>
                    </div>

                </div>
            )}
        </>
    )
}

export default Nav