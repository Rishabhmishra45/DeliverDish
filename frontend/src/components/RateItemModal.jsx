import React, { useState } from 'react'
import { FaStar, FaRegStar } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import axios from 'axios'
import { serverUrl } from '../App'

const RateItemModal = ({ item, orderId, shopOrderId, onClose, onSuccess }) => {

    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const handleSubmit = async () => {

        if (rating === 0) {
            setErrorMsg("Please select a rating")
            return
        }

        setLoading(true)
        setErrorMsg("")

        try {

            await axios.post(
                `${serverUrl}/api/review/add-review`,
                {
                    orderId,
                    shopOrderId,
                    itemId: item.item._id,
                    rating,
                    comment
                },
                { withCredentials: true }
            )

            onSuccess(item.item._id)
            onClose()

        } catch (error) {
            setErrorMsg(error?.response?.data?.message || "Failed to submit review")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='fixed inset-0 bg-black/40 z-[100000] flex items-center justify-center p-4'>
            <div className='bg-white rounded-2xl w-full max-w-sm p-5 sm:p-6 relative'>

                <button
                    onClick={onClose}
                    className='absolute top-3 right-3 text-gray-400 hover:text-gray-600'
                >
                    <MdClose size={22} />
                </button>

                <div className='flex items-center gap-3 mb-4'>
                    {item.item?.image &&
                        <img
                            src={item.item.image}
                            alt={item.item?.name}
                            className='w-12 h-12 rounded-lg object-cover border border-gray-200'
                        />
                    }
                    <h3 className='text-base sm:text-lg font-bold text-gray-800'>
                        {item.item?.name}
                    </h3>
                </div>

                <p className='text-sm text-gray-600 mb-2'>How was this item?</p>

                <div className='flex items-center gap-1.5 mb-4'>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className='cursor-pointer'
                        >
                            {star <= (hoverRating || rating)
                                ? <FaStar size={26} className='text-yellow-400' />
                                : <FaRegStar size={26} className='text-yellow-400' />
                            }
                        </button>
                    ))}
                </div>

                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder='Write a comment (optional)'
                    rows={3}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#ff4d2d] text-sm resize-none mb-3'
                />

                {errorMsg &&
                    <p className='text-red-500 text-xs mb-3'>{errorMsg}</p>
                }

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className='w-full bg-[#ff4d2d] text-white py-2.5 rounded-full font-medium hover:bg-orange-600 transition-colors duration-200 disabled:opacity-60'
                >
                    {loading ? "Submitting..." : "Submit Review"}
                </button>

            </div>
        </div>
    )
}

export default RateItemModal