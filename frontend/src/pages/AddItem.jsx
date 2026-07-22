import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaUtensils } from 'react-icons/fa'
import { IoIosArrowRoundBack } from 'react-icons/io'
import axios from 'axios'
import { serverUrl } from '../App'
import { setMyShopData } from '../redux/ownerSlice'

const categories = [
  "Snacks",
  "Main Course",
  "Desserts",
  "Pizza",
  "Burgers",
  "Sandwiches",
  "South Indian",
  "North Indian",
  "Chinese",
  "Fast Food",
  "Others"
]

const AddItem = () => {

  const { myShopData } = useSelector(state => state.owner)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [category, setCategory] = useState(categories[0])
  const [foodType, setFoodType] = useState("veg")
  const [price, setPrice] = useState("")
  const [frontendImage, setFrontendImage] = useState(null)
  const [backendImage, setBackendImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      setBackendImage(file)
      setFrontendImage(URL.createObjectURL(file))
    }
  }

  const handleAddItem = async (e) => {
    e.preventDefault()

    setLoading(true)

    try {

      const formData = new FormData()
      formData.append("name", name)
      formData.append("category", category)
      formData.append("foodType", foodType)
      formData.append("price", price)
      if (backendImage) {
        formData.append("image", backendImage)
      }

      const result = await axios.post(
        `${serverUrl}/api/item/add-item`,
        formData,
        { withCredentials: true }
      )

      dispatch(setMyShopData({
        ...myShopData,
        items: [result.data, ...(myShopData?.items || [])]
      }))

      navigate("/")

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex items-center justify-center p-4 relative'>

      <div
        className='absolute top-[20px] left-[20px] z-[10] cursor-pointer'
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
      </div>

      <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-orange-100'>

        <div className='flex flex-col items-center mb-4'>
          <div className='w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-2'>
            <FaUtensils className='text-[#ff4d2d] w-8 h-8' />
          </div>
          <h2 className='text-2xl font-bold text-gray-800'>
            Add Food Item
          </h2>
        </div>

        <form onSubmit={handleAddItem} className='space-y-4'>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
            <input
              type="text"
              placeholder='Enter Food Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#ff4d2d]'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Food Image</label>
            <input
              type="file"
              accept='image/*'
              onChange={handleImage}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm'
            />
            {frontendImage &&
              <div className='w-full h-40 mt-3 rounded-xl overflow-hidden border-2 border-orange-200 bg-gray-50'>
                <img
                  src={frontendImage}
                  alt="food"
                  className='w-full h-full object-cover'
                />
              </div>
            }
          </div>

          <div className='flex gap-3'>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#ff4d2d] bg-white'
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Food Type</label>
              <select
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#ff4d2d] bg-white'
                required
              >
                <option value="veg">Veg</option>
                <option value="non veg">Non Veg</option>
              </select>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Price</label>
            <input
              type="number"
              placeholder='Enter Price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min={0}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#ff4d2d]'
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-[#ff4d2d] text-white py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200 disabled:opacity-60'
          >
            {loading ? "Adding..." : "Add Item"}
          </button>

        </form>

      </div>

    </div>
  )
}

export default AddItem