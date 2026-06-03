import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setLoading, setUserData } from "../redux/userSlice";

function useGetCurrentUser() {

    const dispatch = useDispatch()

    useEffect(() => {

        const fetchUser = async () => {

            dispatch(setLoading(true))

            try {

                const result = await axios.get(
                    `${serverUrl}/api/user/current`,
                    {
                        withCredentials: true
                    }
                )

                dispatch(setUserData(result.data))

            } catch (error) {

                dispatch(setUserData(null))
                console.log(error)

            } finally {

                dispatch(setLoading(false))
            }
        }

        fetchUser()

    }, [])

}

export default useGetCurrentUser