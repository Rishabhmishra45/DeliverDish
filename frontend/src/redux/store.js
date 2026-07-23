import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice"
import ownerSlice from "./ownerSlice"
import citySlice from "./citySlice"

export const store = configureStore({
    reducer: {
        user: userSlice,
        owner: ownerSlice,
        city: citySlice
    }
})