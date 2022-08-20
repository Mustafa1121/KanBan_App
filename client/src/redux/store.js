import { configureStore } from "@reduxjs/toolkit";
import userReducer from './features/userSlice'
import boardReducer from './features/boardSlice'
import FavoriteReducer from './features/FavoriteSlice'


export const store = configureStore({
    reducer: {
        user: userReducer,
        board: boardReducer,
        favorites: FavoriteReducer
    }
})