import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setShopsInMyCity } from "../redux/citySlice";

function useGetShopByCity() {

    const dispatch = useDispatch()
    const { city } = useSelector(state => state.user)

    useEffect(() => {

        if (!city) return

        const fetchShops = async () => {
            try {

                const result = await axios.get(
                    `${serverUrl}/api/shop/get-shop-by-city/${city}`,
                    { withCredentials: true }
                )

                dispatch(setShopsInMyCity(result.data))

            } catch (error) {
                console.log(error)
            }
        }

        fetchShops()

    }, [city])

}

export default useGetShopByCity