import { createSlice } from "@reduxjs/toolkit";

const getSavedShops = () => {
    try {
        const saved = localStorage.getItem("shopsInMyCity")
        return saved ? JSON.parse(saved) : []
    } catch (error) {
        return []
    }
}

const citySlice = createSlice({
    name: "city",
    initialState: {
        shopsInMyCity: getSavedShops()
    },
    reducers: {
        setShopsInMyCity: (state, action) => {
            state.shopsInMyCity = action.payload
            localStorage.setItem("shopsInMyCity", JSON.stringify(action.payload))
        }
    }
})

export const { setShopsInMyCity } = citySlice.actions
export default citySlice.reducer