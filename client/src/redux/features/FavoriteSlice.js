import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: [] }

export const FavoriteSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        setFavoriteList: (state, action) => {
            state.value = action.payload
        }
    }
})

export const { setFavoriteList } = FavoriteSlice.actions

export default FavoriteSlice.reducer