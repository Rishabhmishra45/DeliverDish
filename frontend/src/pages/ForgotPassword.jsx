import React, { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from "../App"

const ForgotPassword = () => {

    const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const handleSendOtp = async () => {
        setError("")
        setSuccess("")
        
        if (!email) {
            return setError("Email is required")
        }
        
        if (!email.includes("@")) {
            return setError("Please enter a valid email")
        }

        setIsLoading(true)

        try {
            const result = await axios.post(`${serverUrl}/api/auth/send-otp`, { email },
                { withCredentials: true })
            console.log(result)
            setSuccess("OTP sent successfully to your email!")
            setStep(2)
        } catch (error) {
            console.log(error)
            setError(
                error.response?.data?.message || 
                "Failed to send OTP. Please try again."
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyOtp = async () => {
        setError("")
        setSuccess("")
        
        if (!otp) {
            return setError("OTP is required")
        }
        
        if (otp.length < 4) {
            return setError("Please enter a valid OTP")
        }

        setIsLoading(true)

        try {
            const result = await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp },
                { withCredentials: true })
            console.log(result)
            setSuccess("OTP verified successfully!")
            setStep(3)
        } catch (error) {
            console.log(error)
            setError(
                error.response?.data?.message || 
                "Invalid OTP. Please try again."
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetPassword = async () => {
        setError("")
        setSuccess("")
        
        if (!newPassword) {
            return setError("New password is required")
        }
        
        if (newPassword.length < 6) {
            return setError("Password must be at least 6 characters")
        }
        
        if (newPassword !== confirmPassword) {
            return setError("Passwords do not match")
        }

        setIsLoading(true)

        try {
            const result = await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword },
                { withCredentials: true })
            console.log(result)
            setSuccess("Password reset successfully!")
            setTimeout(() => {
                navigate("/signin")
            }, 1500)
        } catch (error) {
            console.log(error)
            setError(
                error.response?.data?.message || 
                "Failed to reset password. Please try again."
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='flex w-full items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 bg-[#fff9f6]'>
            <div className='bg-white rounded-xl shadow-lg w-full max-w-[95%] sm:max-w-md md:max-w-lg lg:max-w-md p-5 sm:p-6 md:p-8 transition-all duration-300'>
                
                {/* Top Section */}
                <div className='flex items-center gap-3 mb-6'>
                    <IoIosArrowRoundBack
                        size={30}
                        className='text-[#ff4d2d] cursor-pointer hover:opacity-70 transition-opacity'
                        onClick={() => navigate("/signin")}
                    />
                    <h1 className='text-xl sm:text-2xl font-bold text-[#ff4d2d]'>
                        Forgot Password
                    </h1>
                </div>

                {/* Error Message */}
                {error && (
                    <div className='mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-xs sm:text-sm font-medium'>
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className='mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-xs sm:text-sm font-medium'>
                        {success}
                    </div>
                )}

                {/* Step 1: Email */}
                {step === 1 && (
                    <div>
                        <div className='mb-6'>
                            <label
                                htmlFor="email"
                                className='block text-gray-700 font-medium mb-1 text-sm sm:text-base'
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className='w-full border-[1px] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm sm:text-base transition-all'
                                style={{ borderColor: error ? '#ef4444' : '#e5e7eb', outlineColor: '#ff4d2d' }}
                                placeholder='Enter your email'
                                onChange={(e) => {
                                    setError("")
                                    setEmail(e.target.value)
                                }}
                                value={email}
                                required
                            />
                            <p className='text-xs text-gray-500 mt-1'>
                                We'll send a password reset OTP to this email
                            </p>
                        </div>

                        <button
                            className='w-full font-semibold py-2.5 rounded-lg transition-all duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base'
                            onClick={handleSendOtp}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Sending OTP...</span>
                                </div>
                            ) : (
                                "Send OTP"
                            )}
                        </button>
                    </div>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                    <div>
                        <div className='mb-2'>
                            <label
                                htmlFor="otp"
                                className='block text-gray-700 font-medium mb-1 text-sm sm:text-base'
                            >
                                OTP Code
                            </label>
                            <input
                                type="text"
                                id="otp"
                                className='w-full border-[1px] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50  sm:text-base text-center tracking-widest text-lg'
                                style={{ borderColor: error ? '#ef4444' : '#e5e7eb', outlineColor: '#ff4d2d' }}
                                placeholder='Enter 6-digit OTP'
                                onChange={(e) => {
                                    setError("")
                                    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                                    setOtp(value)
                                }}
                                value={otp}
                                maxLength={6}
                                required
                            />
                        </div>
                        <p className='text-xs text-gray-500 mb-6'>
                            Enter the OTP sent to {email}
                        </p>

                        <button
                            className='w-full font-semibold py-2.5 rounded-lg transition-all duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base'
                            onClick={handleVerifyOtp}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Verifying...</span>
                                </div>
                            ) : (
                                "Verify OTP"
                            )}
                        </button>

                        <button
                            className='w-full mt-3 text-sm text-[#ff4d2d] hover:underline cursor-pointer'
                            onClick={handleSendOtp}
                        >
                            Resend OTP
                        </button>
                    </div>
                )}

                {/* Step 3: Reset Password */}
                {step === 3 && (
                    <div>
                        <div className='mb-6'>
                            <label
                                htmlFor="newPassword"
                                className='block text-gray-700 font-medium mb-1 text-sm sm:text-base'
                            >
                                New Password
                            </label>
                            <div className='relative'>
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    id="newPassword"
                                    className='w-full border-[1px] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm sm:text-base pr-10'
                                    style={{ borderColor: error ? '#ef4444' : '#e5e7eb', outlineColor: '#ff4d2d' }}
                                    placeholder='Enter new password'
                                    onChange={(e) => {
                                        setError("")
                                        setNewPassword(e.target.value)
                                    }}
                                    value={newPassword}
                                    required
                                />
                                <button
                                    type='button'
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer'
                                    onClick={() => setShowNewPassword(prev => !prev)}
                                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                                >
                                    {!showNewPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
                                </button>
                            </div>
                            <p className='text-xs text-gray-500 mt-1'>Password must be at least 6 characters</p>
                        </div>

                        <div className='mb-6'>
                            <label
                                htmlFor="confirmPassword"
                                className='block text-gray-700 font-medium mb-1 text-sm sm:text-base'
                            >
                                Confirm Password
                            </label>
                            <div className='relative'>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    className='w-full border-[1px] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm sm:text-base pr-10'
                                    style={{ borderColor: error ? '#ef4444' : '#e5e7eb', outlineColor: '#ff4d2d' }}
                                    placeholder='Confirm your new password'
                                    onChange={(e) => {
                                        setError("")
                                        setConfirmPassword(e.target.value)
                                    }}
                                    value={confirmPassword}
                                    required
                                />
                                <button
                                    type='button'
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer'
                                    onClick={() => setShowConfirmPassword(prev => !prev)}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {!showConfirmPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            className='w-full font-semibold py-2.5 rounded-lg transition-all duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base'
                            onClick={handleResetPassword}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Resetting Password...</span>
                                </div>
                            ) : (
                                "Reset Password"
                            )}
                        </button>
                    </div>
                )}

                {/* Back to Sign In Link */}
                <div className='mt-6 text-center'>
                    <button
                        onClick={() => navigate("/signin")}
                        className='text-gray-500 text-sm hover:text-[#ff4d2d] transition-colors cursor-pointer'
                    >
                        ← Back to Sign In
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword