import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { roomsSlice } from './slices/roomsSlice'
import { furnitureSlice } from './slices/furnitureSlice'
import { uiSlice, persistConfig } from './slices/uiSlice'

export const usePlannerStore = create(
  persist(
    (set, get) => ({
      ...roomsSlice(set, get),
      ...furnitureSlice(set, get),
      ...uiSlice(set, get),
    }),
    persistConfig
  )
)
