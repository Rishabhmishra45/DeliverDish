import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { setCartItems } from "../redux/cartSlice";

function useGetCart() {

    const dispatch = useDispatch()

    useEffect(() => {

        const fetchCart = async () => {
            try {

                const result = await axios.get(
                    `${serverUrl}/api/cart/get-cart`,
                    { withCredentials: true }
                )

                dispatch(setCartItems(result.data.cart))

            } catch (error) {
                console.log(error)
            }
        }

        fetchCart()

    }, [])

}

export default useGetCart