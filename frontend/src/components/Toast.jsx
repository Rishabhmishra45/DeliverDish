import React from 'react'

const Toast = ({ toast }) => {

    if (!toast.show) return null

    const bgColor = toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'

    return (
        <div className={`fixed top-[80px] right-4 z-[999999] ${bgColor} text-white text-xs sm:text-sm font-medium rounded-lg overflow-hidden shadow-lg w-[200px] sm:w-[240px]`}>
            <p className='px-3 py-2'>{toast.message}</p>
            <div className='h-1 bg-white/30 w-full'>
                <div
                    className='h-full bg-white'
                    style={{
                        width: toast.full ? '0%' : '100%',
                        transition: toast.full ? 'width 2s linear' : 'none'
                    }}
                ></div>
            </div>
        </div>
    )
}

export default Toast