import React from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from '../components/UserDashboard'
import OwnerDashboard from '../components/OwnerDashboard'
import DeliveryBoy from './DeliveryBoy'

function Home() {
    const { userData } = useSelector(state => state.user)
    return (
        <>
            {userData?.role == "user" && <UserDashboard />}
            {userData?.role == "owner" && <OwnerDashboard />}
            {userData?.role == "deliveryBoy" && <DeliveryBoy />}
        </>
    )
}

export default Home