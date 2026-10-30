import { configureStore } from '@reduxjs/toolkit'
import { Redux } from './Redux'

export const Store = configureStore({
    reducer: {
        auth: Redux.reducer
    }
})

export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch