import React from 'react'
import Nav from './Nav'

function UserDashboard() {

    return (
        <div className='min-h-screen bg-[#fff9f6]'>

            {/* Navbar */}
            <Nav />

            {/* Main Content - Added padding top to adjust for smaller navbar */}
            <div className='pt-[85px]'>
                {/* Dashboard Content */}
            </div>

        </div>
    )
}

export default UserDashboard