import React, { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from "../App"

const ForgotPassword = () => {

    const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const navigate = useNavigate()

    const handleSendOtp = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/auth/send-otp`, { email },
                { withCredentials: true })
            console.log(result)
            setStep(2)
        } catch (error) {
            console.log(error)
        }
    }

    const handleVerifyOtp = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp },
                { withCredentials: true })
            console.log(result)
            setStep(3)
        } catch (error) {
            console.log(error)
        }
    }

    const handleResetPassword = async () => {
        if (newPassword != confirmPassword) {
            return null
        }
        try {
            const result = await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword },
                { withCredentials: true })
            console.log(result)
            navigate("/signin")
        } catch (error) {
            console.log(error)
        }
    }

    return (

        <div className='flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]'>

            <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-8'>

                {/* top section */}
                <div className='flex items-center gap-3 mb-6'>

                    <IoIosArrowRoundBack
                        size={30}
                        className='text-[#ff4d2d] cursor-pointer'
                        onClick={() => navigate("/signin")}
                    />

                    <h1 className='text-2xl font-bold text-[#ff4d2d]'>
                        Forgot Password
                    </h1>

                </div>

                {
                    step === 1 &&

                    <div>

                        {/* email */}
                        <div className='mb-6'>

                            <label
                                htmlFor="email"
                                className='block text-gray-700 font-medium mb-1'
                            >
                                Email
                            </label>

                            <input
                                type="email"
                                className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#ff4d2d] transition duration-200'
                                placeholder='Enter your Email'
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />

                        </div>

                        {/* send otp button */}
                        <button
                            className='w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer'
                            onClick={handleSendOtp}
                        >
                            Send OTP
                        </button>

                    </div>
                }

                {
                    step == 2
                    &&
                    <div>

                        <div className='mb-6'>

                            <label
                                htmlFor="email"
                                className='block text-gray-700 font-medium mb-1'
                            >
                                OTP
                            </label>

                            <input
                                type="email"
                                className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none'
                                placeholder='Enter OTP'
                                onChange={(e) => setOtp(e.target.value)}
                                value={otp}
                            />

                        </div>

                        <button
                            className={'w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer'}
                            onClick={handleVerifyOtp}
                        >
                            Verify
                        </button>

                    </div>
                }

                {
                    step == 3
                    &&
                    <div>

                        <div className='mb-6'>

                            <label
                                htmlFor="newPassword"
                                className='block text-gray-700 font-medium mb-1'
                            >
                                New Password
                            </label>

                            <input
                                type="email"
                                className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none'
                                placeholder='Enter New Password'
                                onChange={(e) => setNewPassword(e.target.value)}
                                value={newPassword}
                            />

                        </div>

                        <div className='mb-6'>

                            <label
                                htmlFor="ConfirmPassword"
                                className='block text-gray-700 font-medium mb-1'
                            >
                                Confirm Password
                            </label>

                            <input
                                type="email"
                                className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none'
                                placeholder='Confirm Password'
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                            />

                        </div>

                        <button
                            className={'w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer'}
                            onClick={handleResetPassword}
                        >
                            Reset Password
                        </button>

                    </div>
                }

            </div>

        </div>
    )
}

export default ForgotPassword