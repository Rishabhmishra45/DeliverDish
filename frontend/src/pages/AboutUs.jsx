import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBolt, FaShieldHeart, FaMapLocationDot, FaHandshake } from 'react-icons/fa6'
import { IoFastFoodOutline } from 'react-icons/io5'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const stats = [
  { label: "Cities Served", value: "1+" },
  { label: "Partner Restaurants", value: "10+" },
  { label: "Happy Customers", value: "100+" },
  { label: "Deliveries Completed", value: "500+" }
]

const values = [
  {
    icon: FaBolt,
    title: "Speed",
    description: "From order to doorstep as fast as possible, without ever compromising on food quality."
  },
  {
    icon: FaShieldHeart,
    title: "Trust",
    description: "Every restaurant on our platform is verified, and every order is tracked end-to-end for your peace of mind."
  },
  {
    icon: FaMapLocationDot,
    title: "Live Tracking",
    description: "Know exactly where your food is, in real time, from the kitchen to your front door."
  },
  {
    icon: FaHandshake,
    title: "Community",
    description: "We support local restaurants and delivery partners, helping small businesses thrive in every city we serve."
  }
]

const AboutUs = () => {

  const navigate = useNavigate()

  return (
    <div className='min-h-screen bg-[#fff9f6] flex flex-col'>
      <Nav />

      <div className='pt-[90px] flex-1'>

        {/* Hero Section */}
        <div className='max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-center'>
          <div className='w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#ff4d2d] flex items-center justify-center mx-auto mb-6 shadow-lg'>
            <IoFastFoodOutline className='text-white' size={34} />
          </div>

          <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
            Bringing your favourite food, <span className='text-[#ff4d2d]'>right to your door</span>
          </h1>

          <p className='text-gray-500 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed'>
            DeliverDish connects hungry customers with the best local restaurants in their city —
            fast delivery, live order tracking, and a seamless experience from browse to bite.
          </p>
        </div>

        {/* Stats */}
        <div className='max-w-5xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4'>
            {stats.map((stat, index) => (
              <div
                key={index}
                className='bg-white rounded-2xl shadow-md border border-orange-100 p-4 sm:p-6 text-center hover:shadow-lg transition-shadow duration-300'
              >
                <p className='text-xl sm:text-2xl md:text-3xl font-bold text-[#ff4d2d]'>
                  {stat.value}
                </p>
                <p className='text-gray-500 text-xs sm:text-sm mt-1'>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Story */}
        <div className='max-w-5xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16'>
          <div className='bg-white rounded-2xl shadow-md border border-orange-100 p-6 sm:p-10 grid md:grid-cols-2 gap-6 sm:gap-10 items-center'>
            <div>
              <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4'>
                Our Story
              </h2>
              <p className='text-gray-600 text-sm sm:text-base leading-relaxed mb-3'>
                DeliverDish started with a simple idea — food delivery should feel effortless, honest, and fast.
                We noticed people wanted more than just an order tracker that says "on the way" for an hour with
                no real information.
              </p>
              <p className='text-gray-600 text-sm sm:text-base leading-relaxed'>
                So we built a platform with live GPS tracking, transparent pricing, and a smooth ordering
                experience — connecting local restaurants, delivery partners, and customers on one simple app.
              </p>
            </div>
            <div className='grid grid-cols-2 gap-3 sm:gap-4'>
              <div className='bg-orange-50 rounded-xl p-4 sm:p-5 text-center'>
                <p className='text-lg sm:text-xl font-bold text-[#ff4d2d]'>For Customers</p>
                <p className='text-gray-500 text-xs sm:text-sm mt-1'>Order in seconds, track in real time</p>
              </div>
              <div className='bg-orange-50 rounded-xl p-4 sm:p-5 text-center'>
                <p className='text-lg sm:text-xl font-bold text-[#ff4d2d]'>For Restaurants</p>
                <p className='text-gray-500 text-xs sm:text-sm mt-1'>Reach more customers, grow faster</p>
              </div>
              <div className='bg-orange-50 rounded-xl p-4 sm:p-5 text-center'>
                <p className='text-lg sm:text-xl font-bold text-[#ff4d2d]'>For Delivery Partners</p>
                <p className='text-gray-500 text-xs sm:text-sm mt-1'>Flexible work, fair earnings</p>
              </div>
              <div className='bg-orange-50 rounded-xl p-4 sm:p-5 text-center'>
                <p className='text-lg sm:text-xl font-bold text-[#ff4d2d]'>For Everyone</p>
                <p className='text-gray-500 text-xs sm:text-sm mt-1'>A better way to order food</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className='max-w-5xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16'>
          <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8 sm:mb-10'>
            What We Stand For
          </h2>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5'>
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className='bg-white rounded-2xl shadow-md border border-orange-100 p-5 sm:p-6 hover:shadow-lg transition-shadow duration-300'
                >
                  <div className='w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-4'>
                    <Icon className='text-[#ff4d2d]' size={20} />
                  </div>
                  <h3 className='text-base sm:text-lg font-bold text-gray-800 mb-2'>
                    {value.title}
                  </h3>
                  <p className='text-gray-500 text-xs sm:text-sm leading-relaxed'>
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className='max-w-5xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16'>
          <div className='bg-[#ff4d2d] rounded-2xl p-8 sm:p-12 text-center shadow-lg'>
            <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3'>
              Hungry already?
            </h2>
            <p className='text-orange-50 text-sm sm:text-base mb-6 max-w-lg mx-auto'>
              Explore restaurants near you and get your favourite food delivered in minutes.
            </p>
            <button
              onClick={() => navigate("/")}
              className='bg-white text-[#ff4d2d] px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold shadow-md hover:bg-orange-50 hover:scale-105 active:scale-95 transition-all duration-300'
            >
              Order Now
            </button>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}

export default AboutUs