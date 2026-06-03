import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCity } from "../redux/userSlice";

function useGetCity() {

    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)

    const apiKey = import.meta.env.VITE_GEOAPIKEY

    useEffect(() => {

        const savedCity = localStorage.getItem("city")

        if (savedCity) {
            dispatch(setCity(savedCity))
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {

                try {

                    const latitude = position.coords.latitude
                    const longitude = position.coords.longitude

                    console.log("Latitude:", latitude)
                    console.log("Longitude:", longitude)
                    console.log("Accuracy:", position.coords.accuracy)

                    const result = await axios.get(
                        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
                    )

                    console.log(result.data)

                    const locationData = result?.data?.results?.[0]

                    const city =
                        locationData?.city ||
                        locationData?.town ||
                        locationData?.village ||
                        locationData?.county ||
                        locationData?.state_district ||
                        locationData?.state

                    if (city) {
                        dispatch(setCity(city))
                        localStorage.setItem("city", city)
                    }

                } catch (error) {
                    console.log(error)
                }

            },
            (error) => {
                console.log(error)
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        )

    }, [userData])

}

export default useGetCity