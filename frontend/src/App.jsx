import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import useGetCity from './hooks/useGetCity'
import useGetMyShop from './hooks/useGetMyShop'
import useGetShopByCity from './hooks/useGetShopByCity'
import useGetCart from './hooks/useGetCart'
import useUpdateLocation from './hooks/useUpdateLocation'
import CreateEditShop from './pages/CreateEditShop'
import AddItem from './pages/AddItem'
import EditItem from './pages/EditItem'
import ShopDetails from './pages/ShopDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import MyOrders from './pages/MyOrders'
import OwnerOrders from './pages/OwnerOrders'
import DeliveryBoy from './pages/DeliveryBoy'
import TrackOrder from './pages/TrackOrder'

export const serverUrl = import.meta.env.VITE_API_URL;

const App = () => {

  useGetCurrentUser()
  useGetCity()
  useGetMyShop()
  useGetShopByCity()
  useGetCart()
  useUpdateLocation()

  const { userData, loading } = useSelector(state => state.user)

  if (loading) {
    return (
      <div className='w-screen h-screen flex items-center justify-center bg-[#fff9f6]'>
        <div className='w-10 h-10 border-4 border-[#ff4d2d] border-t-transparent rounded-full animate-spin'></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={"/"} />} />
      <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to={"/"} />} />
      <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />} />
      <Route path='/' element={userData ? <Home /> : <Navigate to={"/signin"} />} />
      <Route path='/create-edit-shop' element={userData ? <CreateEditShop /> : <Navigate to={"/signin"} />} />
      <Route path='/add-food' element={userData ? <AddItem /> : <Navigate to={"/signin"} />} />
      <Route path='/edit-item/:itemId' element={userData ? <EditItem /> : <Navigate to={"/signin"} />} />
      <Route path='/shop/:shopId' element={userData ? <ShopDetails /> : <Navigate to={"/signin"} />} />
      <Route path='/cart' element={userData ? <Cart /> : <Navigate to={"/signin"} />} />
      <Route path='/checkout' element={userData ? <Checkout /> : <Navigate to={"/signin"} />} />
      <Route path='/my-orders' element={userData ? <MyOrders /> : <Navigate to={"/signin"} />} />
      <Route path='/owner-orders' element={userData ? <OwnerOrders /> : <Navigate to={"/signin"} />} />
      <Route path='/delivery-dashboard' element={userData ? <DeliveryBoy /> : <Navigate to={"/signin"} />} />
      <Route path='/track-order/:orderId/:shopOrderId' element={userData ? <TrackOrder /> : <Navigate to={"/signin"} />} />
    </Routes>
  )
}

export default App