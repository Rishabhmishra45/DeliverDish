import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
    name: "search",
    initialState: {
        searchText: ""
    },
    reducers: {
        setSearchText: (state, action) => {
            state.searchText = action.payload
        }
    }
})

export const { setSearchText } = searchSlice.actions
export default searchSlice.reducer