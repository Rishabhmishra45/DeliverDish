import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { serverUrl } from '../App';

const SignIn = () => {

  const primaryColor = "#ff4d2d";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {

    if (!email || !password) {
      return alert("All fields are required");
    }

    if (password.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    try {

      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          email,
          password
        },
        {
          withCredentials: true
        }
      );

      console.log(result.data);

      alert("Login Successful");

      navigate("/");

    } catch (error) {

      console.log(error.response?.data);

      alert(
        error.response?.data?.message || "Login Failed"
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
          Login to continue ordering delicious food
        </p>

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type='button'
              className='absolute right-3 top-[14px] text-gray-500 cursor-pointer'
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

        {/* forgot password */}
        <div className='flex justify-end mb-5'>

          <button
            type='button'
            onClick={() => navigate("/forgot-password")}
            className='text-[#ff4d2d] text-sm font-semibold hover:text-[#e64323] hover:underline transition duration-200 cursor-pointer'
          >
            Forgot Password ?
          </button>

        </div>

        {/* signin button */}
        <button
          className='w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer'
          onClick={handleSignIn}
        >
          Sign In
        </button>

        {/* google signin */}
        <button
          className='w-full mt-4 flex items-center justify-center cursor-pointer gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100'
        >
          <FcGoogle size={20} />
          <span>Sign in with Google</span>
        </button>

        {/* signup redirect */}
        <p
          className='text-center mt-6 cursor-pointer'
          onClick={() => navigate("/signup")}
        >
          Don&apos;t have an account ?
          <span className='text-[#ff4d2d]'> Sign Up</span>
        </p>

      </div>
    </div>
  );
};

export default SignIn;