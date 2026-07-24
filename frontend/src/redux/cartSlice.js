import { createSlice } from "@reduxjs/toolkit";

const getSavedCart = () => {
    try {
        const saved = localStorage.getItem("cartItems")
        return saved ? JSON.parse(saved) : []
    } catch (error) {
        return []
    }
}

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: getSavedCart()
    },
    reducers: {
        setCartItems: (state, action) => {
            state.cartItems = action.payload
            localStorage.setItem("cartItems", JSON.stringify(action.payload))
        }
    }
})

export const { setCartItems } = cartSlice.actions
export default cartSlice.reducer