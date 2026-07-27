import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa6'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'

const Footer = () => {

    const navigate = useNavigate()
    const currentYear = new Date().getFullYear()

    return (
        <footer className='w-full bg-white border-t border-orange-100 mt-10'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12'>

                <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6'>

                    {/* Brand */}
                    <div className='col-span-2 md:col-span-1'>
                        <h2
                            onClick={() => navigate("/")}
                            className='text-xl sm:text-2xl font-bold text-[#ff4d2d] cursor-pointer w-fit'
                        >
                            DeliverDish
                        </h2>
                        <p className='text-gray-500 text-xs sm:text-sm mt-3 leading-relaxed max-w-[240px]'>
                            Delicious food, delivered fast. Order from your favourite local restaurants in just a few taps.
                        </p>

                        <div className='flex items-center gap-3 mt-4'>
                            <a
                                href="#"
                                aria-label="Facebook"
                                className='w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#ff4d2d] hover:bg-[#ff4d2d] hover:text-white transition-colors duration-200'
                            >
                                <FaFacebookF size={13} />
                            </a>
                            <a
                                href="#"
                                aria-label="Instagram"
                                className='w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#ff4d2d] hover:bg-[#ff4d2d] hover:text-white transition-colors duration-200'
                            >
                                <FaInstagram size={13} />
                            </a>
                            <a
                                href="#"
                                aria-label="Twitter"
                                className='w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#ff4d2d] hover:bg-[#ff4d2d] hover:text-white transition-colors duration-200'
                            >
                                <FaTwitter size={13} />
                            </a>
                            <a
                                href="#"
                                aria-label="LinkedIn"
                                className='w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#ff4d2d] hover:bg-[#ff4d2d] hover:text-white transition-colors duration-200'
                            >
                                <FaLinkedinIn size={13} />
                            </a>
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className='text-sm sm:text-base font-semibold text-gray-800 mb-3 sm:mb-4'>
                            Company
                        </h3>
                        <ul className='flex flex-col gap-2 sm:gap-2.5'>
                            <li>
                                <a href="/about" className='text-gray-500 text-xs sm:text-sm hover:text-[#ff4d2d] transition-colors duration-200'>
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className='text-gray-500 text-xs sm:text-sm hover:text-[#ff4d2d] transition-colors duration-200'>
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href="#" className='text-gray-500 text-xs sm:text-sm hover:text-[#ff4d2d] transition-colors duration-200'>
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#" className='text-gray-500 text-xs sm:text-sm hover:text-[#ff4d2d] transition-colors duration-200'>
                                    Partner with us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className='text-sm sm:text-base font-semibold text-gray-800 mb-3 sm:mb-4'>
                            Support
                        </h3>
                        <ul className='flex flex-col gap-2 sm:gap-2.5'>
                            <li>
                                <a href="#" className='text-gray-500 text-xs sm:text-sm hover:text-[#ff4d2d] transition-colors duration-200'>
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className='text-gray-500 text-xs sm:text-sm hover:text-[#ff4d2d] transition-colors duration-200'>
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="#" className='text-gray-500 text-xs sm:text-sm hover:text-[#ff4d2d] transition-colors duration-200'>
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className='text-gray-500 text-xs sm:text-sm hover:text-[#ff4d2d] transition-colors duration-200'>
                                    Refund Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className='text-sm sm:text-base font-semibold text-gray-800 mb-3 sm:mb-4'>
                            Contact Us
                        </h3>
                        <ul className='flex flex-col gap-2.5 sm:gap-3'>
                            <li className='flex items-start gap-2 text-gray-500 text-xs sm:text-sm'>
                                <MdLocationOn size={16} className='text-[#ff4d2d] mt-0.5 flex-shrink-0' />
                                <span>Kukas, Jaipur, Rajasthan, India</span>
                            </li>
                            <li>
                                <a
                                    href="mailto:support@deliverdish.com"
                                    className='flex items-center gap-2 text-gray-500 text-xs sm:text-sm hover:text-[#ff4d2d] transition-colors duration-200'
                                >
                                    <MdEmail size={16} className='text-[#ff4d2d] flex-shrink-0' />
                                    support@deliverdish.com
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+911234567890"
                                    className='flex items-center gap-2 text-gray-500 text-xs sm:text-sm hover:text-[#ff4d2d] transition-colors duration-200'
                                >
                                    <MdPhone size={16} className='text-[#ff4d2d] flex-shrink-0' />
                                    +91 12345 67890
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom bar */}
                <div className='border-t border-gray-100 mt-8 sm:mt-10 pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3'>
                    <p className='text-gray-400 text-[11px] sm:text-xs text-center sm:text-left'>
                        © {currentYear} DeliverDish. All rights reserved.
                    </p>
                    <p className='text-gray-400 text-[11px] sm:text-xs'>
                        Made with ❤️ for food lovers
                    </p>
                </div>

            </div>
        </footer>
    )
}

export default Footer