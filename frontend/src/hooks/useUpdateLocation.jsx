import axios from "axios"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { serverUrl } from "../App"

// sirf deliveryBoy role ke liye chalta hai — city aur location backend me save/update karta hai
function useUpdateLocation() {

    const { userData } = useSelector(state => state.user)
    const apiKey = import.meta.env.VITE_GEOAPIKEY

    useEffect(() => {

        if (userData?.role !== "deliveryBoy") return

        const updateLocation = () => {

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {

                        const latitude = position.coords.latitude
                        const longitude = position.coords.longitude

                        const result = await axios.get(
                            `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
                        )

                        const locationData = result?.data?.results?.[0]

                        const city =
                            locationData?.city ||
                            locationData?.town ||
                            locationData?.village ||
                            locationData?.county ||
                            locationData?.state_district ||
                            locationData?.state

                        if (city) {
                            await axios.post(
                                `${serverUrl}/api/location/update-location`,
                                { city, latitude, longitude },
                                { withCredentials: true }
                            )
                        }

                    } catch (error) {
                        console.log(error)
                    }
                },
                (error) => {
                    console.log(error)
                },
                {
                    enableHighAccuracy: false,
                    timeout: 8000,
                    maximumAge: 0
                }
            )
        }

        updateLocation()

        // har 15 second me location refresh — future live-tracking ke liye bhi useful
        const interval = setInterval(updateLocation, 15000)

        return () => clearInterval(interval)

    }, [userData?.role])

}

export default useUpdateLocation