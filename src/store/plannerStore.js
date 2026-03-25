import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEY, PIXELS_PER_METER, LIMITS } from '../constants'
import { generateId, toMeters } from '../utils'

export const usePlannerStore = create(
  persist(
    (set, get) => ({
      rooms: [],
      furniture: [],
      selectedId: null,

      addRoom: (roomData) => {
        const { rooms } = get()
        const roomNumber = rooms.length + 1
        const newRoom = {
          id: generateId('room'),
          name: `Room ${roomNumber}`,
          x: roomData.x,
          y: roomData.y,
          width: roomData.width,
          height: roomData.height,
          widthMeters: toMeters(roomData.width),
          heightMeters: toMeters(roomData.height),
        }
        set({ rooms: [...rooms, newRoom] })
        return newRoom.id
      },

      updateRoom: (id, updates, oldRoom) => {
        set((state) => {
          const updatedRooms = state.rooms.map((room) =>
            room.id === id
              ? {
                  ...room,
                  ...updates,
                  widthMeters: updates.width !== undefined
                    ? toMeters(Math.max(LIMITS.minRoomSize, updates.width))
                    : room.widthMeters,
                  heightMeters: updates.height !== undefined
                    ? toMeters(Math.max(LIMITS.minRoomSize, updates.height))
                    : room.heightMeters,
                }
              : room
          )

          if (updates.x !== undefined && oldRoom) {
            const deltaX = updates.x - oldRoom.x
            const deltaY = updates.y - oldRoom.y

            if (deltaX !== 0 || deltaY !== 0) {
              const updatedFurniture = state.furniture.map((item) =>
                item.roomId === id
                  ? { ...item, x: item.x + deltaX, y: item.y + deltaY }
                  : item
              )
              return { rooms: updatedRooms, furniture: updatedFurniture }
            }
          }

          return { rooms: updatedRooms }
        })
      },

      deleteRoom: (id) => {
        set((state) => ({
          rooms: state.rooms.filter((room) => room.id !== id),
          furniture: state.furniture.filter((item) => item.roomId !== id),
          selectedId: state.selectedId === id ? null : state.selectedId,
        }))
      },

      renameRoom: (id, name) => {
        set((state) => ({
          rooms: state.rooms.map((room) =>
            room.id === id ? { ...room, name } : room
          ),
        }))
      },

      addFurniture: (furnitureData) => {
        const newFurniture = {
          id: generateId(furnitureData.type),
          ...furnitureData,
        }
        set((state) => ({
          furniture: [...state.furniture, newFurniture],
        }))
        return newFurniture.id
      },

      updateFurniture: (id, updates) => {
        set((state) => ({
          furniture: state.furniture.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }))
      },

      deleteFurniture: (id) => {
        set((state) => ({
          furniture: state.furniture.filter((item) => item.id !== id),
          selectedId: state.selectedId === id ? null : state.selectedId,
        }))
      },

      select: (id) => {
        set({ selectedId: id })
      },

      deselect: () => {
        set({ selectedId: null })
      },

      deleteSelected: () => {
        const { selectedId, rooms, furniture } = get()
        if (!selectedId) return

        if (selectedId.startsWith('room-')) {
          set({
            rooms: rooms.filter((r) => r.id !== selectedId),
            furniture: furniture.filter((f) => f.roomId !== selectedId),
            selectedId: null,
          })
        } else {
          set({
            furniture: furniture.filter((f) => f.id !== selectedId),
            selectedId: null,
          })
        }
      },

      rotateSelected: (angle) => {
        set((state) => ({
          furniture: state.furniture.map((item) =>
            item.id === state.selectedId
              ? { ...item, rotation: (item.rotation || 0) + angle }
              : item
          ),
        }))
      },

      flipSelected: () => {
        set((state) => ({
          furniture: state.furniture.map((item) =>
            item.id === state.selectedId && item.type === 'door'
              ? { ...item, flip: (item.flip || 1) * -1 }
              : item
          ),
        }))
      },

      clearAll: () => {
        set({ rooms: [], furniture: [], selectedId: null })
      },

      getSelectedItem: () => {
        const { selectedId, rooms, furniture } = get()
        if (!selectedId) return null
        return rooms.find((r) => r.id === selectedId) ||
               furniture.find((f) => f.id === selectedId) ||
               null
      },

      isSelectedRoom: () => {
        const { selectedId } = get()
        return selectedId?.startsWith('room-') || false
      },

      isSelectedDoor: () => {
        const { selectedId, furniture } = get()
        const item = furniture.find((f) => f.id === selectedId)
        return item?.type === 'door' || false
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        rooms: state.rooms,
        furniture: state.furniture,
      }),
    }
  )
)
