import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice'

const SignIn = () => {

  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch=useDispatch()
  

  const handleSignIn = async () => {
    setError("");

    if (!email || !password) {
      return setError("All fields are required");
    }

    if (!email.includes("@")) {
      return setError("Please enter a valid email");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setIsLoading(true);

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

      dispatch(setUserData(result.data))
      navigate("/");

    } catch (error) {
      console.log(error.response?.data);
      setError(
        error.response?.data?.message || "Login Failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError("");
    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
        email: result.user.email,
      }, { withCredentials: true });

      dispatch(setUserData(data))
      navigate("/");

    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message ||
        error.message ||
        "Google Authentication Failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

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
          Login to continue ordering delicious food
        </p>

        {/* Error Message */}
        {error && (
          <div className='mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-xs sm:text-sm font-medium'>
            {error}
          </div>
        )}

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
            value={email}
            onChange={(e) => {
              setError("");
              setEmail(e.target.value);
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
              value={password}
              onChange={(e) => {
                setError("");
                setPassword(e.target.value);
              }}
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
        </div>

        {/* Forgot Password */}
        <div className='flex justify-end mb-6'>
          <button
            type='button'
            onClick={() => navigate("/forgot-password")}
            className='text-sm font-semibold hover:underline transition duration-200 cursor-pointer'
            style={{ color: primaryColor }}
          >
            Forgot Password?
          </button>
        </div>

        {/* Sign In Button */}
        <button
          className='w-full font-semibold py-2.5 rounded-lg transition-all duration-200 text-white cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base'
          style={{ backgroundColor: primaryColor }}
          onClick={handleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing In...</span>
            </div>
          ) : (
            "Sign In"
          )}
        </button>

        {/* Google Sign In */}
        <button
          className='w-full mt-4 flex items-center justify-center cursor-pointer gap-2 border rounded-lg px-4 py-2.5 transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base'
          style={{ borderColor: borderColor }}
          onClick={handleGoogleAuth}
          disabled={isLoading}
        >
          <FcGoogle size={20} />
          <span>Sign in with Google</span>
        </button>

        {/* Sign Up Redirect */}
        <p className='text-center mt-6 text-sm sm:text-base'>
          Don't have an account?{' '}
          <button
            onClick={() => navigate("/signup")}
            className='font-semibold hover:underline cursor-pointer'
            style={{ color: primaryColor }}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;