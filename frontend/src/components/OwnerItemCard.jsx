import React, { useState } from 'react'
import { FaPen, FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { setMyShopData } from '../redux/ownerSlice'

const OwnerItemCard = ({ item }) => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { myShopData } = useSelector(state => state.owner)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {

    const confirmDelete = window.confirm(`Delete "${item.name}"?`)
    if (!confirmDelete) return

    setDeleting(true)

    try {

      await axios.delete(
        `${serverUrl}/api/item/delete-item/${item._id}`,
        { withCredentials: true }
      )

      dispatch(setMyShopData({
        ...myShopData,
        items: myShopData.items.filter((i) => i._id !== item._id)
      }))

    } catch (error) {
      console.log(error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className='bg-white rounded-2xl shadow-md border border-orange-100 overflow-hidden hover:shadow-lg transition-shadow duration-300'>
      <div className='relative w-full h-40'>
        <img
          src={item.image}
          alt={item.name}
          className='w-full h-full object-cover'
        />
        <div
          className={`absolute top-2 left-2 w-5 h-5 rounded flex items-center justify-center border-2 bg-white ${item.foodType === "veg" ? "border-green-600" : "border-red-600"}`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${item.foodType === "veg" ? "bg-green-600" : "bg-red-600"}`}></span>
        </div>
        <div className='absolute top-2 right-2 flex gap-2'>
          <button
            onClick={() => navigate(`/edit-item/${item._id}`)}
            className='w-8 h-8 rounded-full bg-[#ff4d2d] flex items-center justify-center shadow-md hover:bg-orange-600 transition-colors duration-200'
          >
            <FaPen className='text-white w-3.5 h-3.5' />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className='w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors duration-200 disabled:opacity-60'
          >
            <FaTrash className='text-white w-3.5 h-3.5' />
          </button>
        </div>
      </div>

      <div className='p-4'>
        <h4 className='text-base font-bold text-gray-800 mb-1'>
          {item.name}
        </h4>
        <p className='text-gray-500 text-xs mb-2'>
          {item.category}
        </p>
        <p className='text-[#ff4d2d] font-semibold text-sm'>
          ₹{item.price}
        </p>
      </div>
    </div>
  )
}

export default OwnerItemCard