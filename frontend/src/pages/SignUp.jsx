import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { serverUrl } from '../App';
import { auth } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const SignUp = () => {

    const primaryColor = "#ff4d2d";
    const hoverColor = "#e64323";
    const bgColor = "#fff9f6";
    const borderColor = "#ddd";

    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("user");

    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobile, setMobile] = useState("");
    const [err, setErr] = useState("")
    const dispatch=useDispatch()

    const handleSignUp = async () => {

        setErr("")

        if (!fullName || !email || !password || !mobile) {
            return setErr("All fields are required")
        }

        if (!email.includes("@")) {
            return setErr("Please enter a valid email")
        }

        if (mobile.length !== 10) {
            return setErr("Mobile number must be exactly 10 digits")
        }

        if (password.length < 6) {
            return setErr("Password must be at least 6 characters")
        }

        try {

            const result = await axios.post(
                `${serverUrl}/api/auth/signup`,
                {
                    fullName,
                    email,
                    password,
                    mobile,
                    role
                },
                {
                    withCredentials: true
                }
            )

            dispatch(setUserData(result.data))
            setErr("")

            navigate("/signin")

        } catch (error) {

            console.log(error.response?.data)

            setErr(
                error.response?.data?.message ||
                "Signup Failed"
            )
        }
    }

    const handleGoogleAuth = async () => {

        setErr("")

        if (!mobile) {
            return setErr("Mobile number is required")
        }

        if (mobile.length !== 10) {
            return setErr("Mobile number must be exactly 10 digits")
        }

        try {

            const provider = new GoogleAuthProvider()

            const result = await signInWithPopup(
                auth,
                provider
            )

            const { data } = await axios.post(
                `${serverUrl}/api/auth/google-auth`,
                {
                    fullName: result.user.displayName,
                    email: result.user.email,
                    role,
                    mobile
                },
                {
                    withCredentials: true
                }
            )

            dispatch(setUserData(data))

            navigate("/")

        } catch (error) {

            console.log(error)

            setErr(
                error.response?.data?.message ||
                error.message ||
                "Google Authentication Failed"
            )
        }
    }

    return (
        <div
            className='min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8'
            style={{ backgroundColor: bgColor }}
        >
            <div
                className='bg-white rounded-xl shadow-lg w-full max-w-[95%] sm:max-w-md md:max-w-lg lg:max-w-md xl:max-w-lg p-5 sm:p-6 md:p-8 border-[1px] transition-all duration-300'
                style={{
                    border: `1px solid ${borderColor}`
                }}
            >
                <h1
                    className='text-2xl sm:text-3xl font-bold mb-2 text-center sm:text-left'
                    style={{ color: primaryColor }}
                >
                    DeliverDish
                </h1>

                <p className='text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base text-center sm:text-left'>
                    Create your account to get started with delicious food deliveries
                </p>
                
                {err && (
                    <div className='mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-xs sm:text-sm font-medium'>
                        {err}
                    </div>
                )}

                {/* Full Name */}
                <div className='mb-4'>
                    <label className='block text-gray-700 font-medium mb-1 text-sm sm:text-base'>
                        Full Name
                    </label>
                    <input
                        type="text"
                        className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm sm:text-base'
                        style={{ border: `1px solid ${borderColor}`, outlineColor: primaryColor }}
                        placeholder='Enter your Full Name'
                        onChange={(e) => {
                            setErr("")
                            setFullName(e.target.value)
                        }}
                        value={fullName}
                        required
                    />
                </div>

                {/* Email */}
                <div className='mb-4'>
                    <label className='block text-gray-700 font-medium mb-1 text-sm sm:text-base'>
                        Email
                    </label>
                    <input
                        type="email"
                        className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm sm:text-base'
                        style={{ border: `1px solid ${borderColor}`, outlineColor: primaryColor }}
                        placeholder='Enter your Email'
                        onChange={(e) => {
                            setErr("")
                            setEmail(e.target.value)
                        }}
                        value={email}
                        required
                    />
                </div>

                {/* Mobile */}
                <div className='mb-4'>
                    <label className='block text-gray-700 font-medium mb-1 text-sm sm:text-base'>
                        Mobile
                    </label>
                    <input
                        type="tel"
                        className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm sm:text-base'
                        style={{ border: `1px solid ${borderColor}`, outlineColor: primaryColor }}
                        placeholder='Enter your Mobile Number'
                        value={mobile}
                        maxLength={10}
                        onChange={(e) => {
                            setErr("")
                            const value = e.target.value.replace(/\D/g, "")
                            setMobile(value)
                        }}
                        required
                    />
                </div>

                {/* Password */}
                <div className='mb-4'>
                    <label className='block text-gray-700 font-medium mb-1 text-sm sm:text-base'>
                        Password
                    </label>
                    <div className='relative'>
                        <input
                            type={showPassword ? "text" : "password"}
                            className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm sm:text-base pr-10'
                            style={{ border: `1px solid ${borderColor}`, outlineColor: primaryColor }}
                            placeholder='Enter your Password'
                            onChange={(e) => {
                                setErr("")
                                setPassword(e.target.value)
                            }}
                            value={password}
                            required
                        />
                        <button
                            type='button'
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer'
                            onClick={() => setShowPassword(prev => !prev)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {!showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
                        </button>
                    </div>
                    <p className='text-xs text-gray-500 mt-1'>Password must be at least 6 characters</p>
                </div>

                {/* Role */}
                <div className='mb-6'>
                    <label className='block text-gray-700 font-medium mb-2 text-sm sm:text-base'>
                        Role
                    </label>
                    <div className='grid grid-cols-3 gap-2 sm:gap-3'>
                        {["user", "owner", "deliveryBoy"].map((r, index) => (
                            <button
                                key={index}
                                type='button'
                                className='px-2 sm:px-3 py-2 rounded-lg cursor-pointer text-center font-medium transition-all duration-200 text-sm sm:text-base hover:scale-105 active:scale-95'
                                onClick={() => setRole(r)}
                                style={
                                    role === r
                                        ? {
                                            backgroundColor: primaryColor,
                                            color: "white",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                                        }
                                        : {
                                            border: `1px solid ${primaryColor}`,
                                            color: primaryColor,
                                            backgroundColor: "white"
                                        }
                                }
                            >
                                {r === "deliveryBoy" ? "Delivery" : r.charAt(0).toUpperCase() + r.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    className='w-full font-semibold py-2.5 rounded-lg transition-all duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base'
                    onClick={handleSignUp}
                >
                    Sign Up
                </button>

                <button
                    className='w-full mt-4 flex items-center justify-center cursor-pointer gap-2 border rounded-lg px-4 py-2.5 transition-all duration-200 border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-sm sm:text-base'
                    onClick={handleGoogleAuth}
                >
                    <FcGoogle size={20} />
                    <span>Sign up with Google</span>
                </button>

                <p
                    className='text-center mt-6 text-sm sm:text-base cursor-pointer hover:opacity-80 transition-opacity'
                    onClick={() => navigate("/signin")}
                >
                    Already have an account?{' '}
                    <span className='font-semibold hover:underline' style={{ color: primaryColor }}>
                        Sign In
                    </span>
                </p>
            </div>
        </div>
    );
};

export default SignUp;