import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice"
import ownerSlice from "./ownerSlice"
import citySlice from "./citySlice"
import searchSlice from "./searchSlice"
import cartSlice from "./cartSlice"

export const store = configureStore({
    reducer: {
        user: userSlice,
        owner: ownerSlice,
        city: citySlice,
        search: searchSlice,
        cart: cartSlice
    }
})