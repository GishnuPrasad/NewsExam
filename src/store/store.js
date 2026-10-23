import { configureStore } from '@reduxjs/toolkit'
import episodesReducer from './episodesSlice'

export const store = configureStore({
  reducer: {
    episodes: episodesReducer,
  },
})
