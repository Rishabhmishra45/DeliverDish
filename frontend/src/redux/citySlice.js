import { createSlice } from "@reduxjs/toolkit";

const citySlice = createSlice({
    name: "city",
    initialState: {
        shopsInMyCity: []
    },
    reducers: {
        setShopsInMyCity: (state, action) => {
            state.shopsInMyCity = action.payload
        }
    }
})

export const { setShopsInMyCity } = citySlice.actions
export default citySlice.reducer