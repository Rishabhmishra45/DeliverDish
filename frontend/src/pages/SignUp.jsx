import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { serverUrl } from '../App';

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

    const handleSignUp = async () => {

        if (!fullName || !email || !password || !mobile) {
            return alert("All fields are required");
        }

        if (mobile.length !== 10) {
            return alert("Mobile number must be exactly 10 digits");
        }

        if (password.length < 6) {
            return alert("Password must be at least 6 characters");
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
            );

            console.log(result.data);

            alert("Signup Successful");

            navigate("/signin");

        } catch (error) {

            console.log(error.response?.data);

            alert(
                error.response?.data?.message || "Signup Failed"
            );
        }
    };

    return (
        <div
            className='min-h-screen w-full flex items-center justify-center p-4'
            style={{ backgroundColor: bgColor }}
        >

            <div
                className='bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px]'
                style={{
                    border: `1px solid ${borderColor}`
                }}
            >

                <h1
                    className='text-3xl font-bold mb-2'
                    style={{ color: primaryColor }}
                >
                    DeliverDish
                </h1>

                <p className='text-gray-600 mb-8'>
                    Create your account to get started with delicious food deliveries
                </p>

                {/* fullname */}
                <div className='mb-4'>
                    <label className='block text-gray-700 font-medium mb-1'>
                        Full Name
                    </label>

                    <input
                        type="text"
                        className='w-full border rounded-lg px-3 py-2 focus:outline-none'
                        placeholder='Enter your Full Name'
                        style={{ border: `1px solid ${borderColor}` }}
                        onChange={(e) => setFullName(e.target.value)}
                        value={fullName}
                    />
                </div>

                {/* email */}
                <div className='mb-4'>
                    <label className='block text-gray-700 font-medium mb-1'>
                        Email
                    </label>

                    <input
                        type="email"
                        className='w-full border rounded-lg px-3 py-2 focus:outline-none'
                        placeholder='Enter your Email'
                        style={{ border: `1px solid ${borderColor}` }}
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>

                {/* mobile */}
                <div className='mb-4'>

                    <label className='block text-gray-700 font-medium mb-1'>
                        Mobile
                    </label>

                    <input
                        type="text"
                        className='w-full border rounded-lg px-3 py-2 focus:outline-none'
                        placeholder='Enter your Mobile Number'
                        style={{ border: `1px solid ${borderColor}` }}
                        value={mobile}
                        maxLength={10}
                        onChange={(e) => {

                            const value = e.target.value.replace(/\D/g, "");

                            setMobile(value);
                        }}
                    />
                </div>

                {/* password */}
                <div className='mb-4'>

                    <label className='block text-gray-700 font-medium mb-1'>
                        Password
                    </label>

                    <div className='relative'>

                        <input
                            type={showPassword ? "text" : "password"}
                            className='w-full border rounded-lg px-3 py-2 focus:outline-none'
                            placeholder='Enter your Password'
                            style={{ border: `1px solid ${borderColor}` }}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />

                        <button
                            type='button'
                            className='absolute right-3 cursor-pointer top-[14px] text-gray-500'
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {
                                !showPassword
                                    ? <FaRegEye />
                                    : <FaRegEyeSlash />
                            }
                        </button>

                    </div>
                </div>

                {/* role */}
                <div className='mb-4'>

                    <label className='block text-gray-700 font-medium mb-1'>
                        Role
                    </label>

                    <div className='flex gap-2'>

                        {
                            ["user", "owner", "deliveryBoy"].map((r, index) => (

                                <button
                                    key={index}
                                    type='button'
                                    className='flex-1 border rounded-lg px-3 py-2 cursor-pointer text-center font-medium transition-colors'
                                    onClick={() => setRole(r)}
                                    style={
                                        role === r
                                            ? {
                                                backgroundColor: primaryColor,
                                                color: "white"
                                            }
                                            : {
                                                border: `1px solid ${primaryColor}`,
                                                color: primaryColor
                                            }
                                    }
                                >
                                    {r}
                                </button>
                            ))
                        }

                    </div>
                </div>

                <button
                    className='w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer'
                    onClick={handleSignUp}
                >
                    Sign Up
                </button>

                <button
                    className='w-full mt-4 flex items-center justify-center cursor-pointer gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100'
                >
                    <FcGoogle size={20} />
                    <span>Sign up with Google</span>
                </button>

                <p
                    className='text-center mt-6 cursor-pointer'
                    onClick={() => navigate("/signin")}
                >
                    Already have an account ?
                    <span className='text-[#ff4d2d]'> Sign In</span>
                </p>

            </div>
        </div>
    );
};

export default SignUp;