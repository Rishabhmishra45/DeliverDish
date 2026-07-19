import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setLoading, setMyShopData } from "../redux/ownerSlice";

function useGetMyShop() {

    const dispatch = useDispatch()

    useEffect(() => {

        const fetchShop = async () => {

            dispatch(setLoading(true))

            try {

                const result = await axios.get(
                    `${serverUrl}/api/shop/get-my`,
                    {
                        withCredentials: true
                    }
                )

                dispatch(setMyShopData(result.data))

            } catch (error) {

                dispatch(setMyShopData(null))
                console.log(error)

            } finally {

                dispatch(setLoading(false))
            }
        }

        fetchShop()

    }, [])

}

export default useGetMyShop