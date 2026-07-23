import React from 'react'

const UserShopCard = ({ shop }) => {
  return (
    <div className='flex-shrink-0 w-[160px] sm:w-[190px] cursor-pointer bg-white rounded-xl shadow-md border border-orange-100 overflow-hidden hover:shadow-lg transition-shadow duration-300'>
      <div className='w-full h-[100px] sm:h-[120px]'>
        <img
          src={shop.image}
          alt={shop.name}
          className='w-full h-full object-cover'
        />
      </div>
      <div className='p-2 sm:p-3'>
        <p className='text-sm sm:text-base font-semibold text-gray-800 truncate'>
          {shop.name}
        </p>
      </div>
    </div>
  )
}

export default UserShopCard