import React from 'react'

const CategoryCard = ({ category, image }) => {
  return (
    <div className='flex-shrink-0 w-[130px] sm:w-[150px] cursor-pointer rounded-2xl overflow-hidden border-2 border-[#ff4d2d]/40 hover:border-[#ff4d2d] hover:shadow-md transition-all duration-200'>
      <div className='w-full h-[100px] sm:h-[115px]'>
        <img
          src={image}
          alt={category}
          className='w-full h-full object-cover'
        />
      </div>
      <div className='bg-white text-center py-2 border-t border-[#ff4d2d]/20'>
        <p className='text-sm sm:text-base font-semibold text-gray-800 truncate px-1'>
          {category}
        </p>
      </div>
    </div>
  )
}

export default CategoryCard