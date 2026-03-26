import { generateId, toMeters } from '../../utils'
import { LIMITS } from '../../constants'

export const roomsSlice = (set, get) => ({
  rooms: [],

  addRoom: (roomData) => {
    const roomNumber = get().rooms.length + 1
    const newRoom = {
      id: generateId('room'),
      name: `Room ${roomNumber}`,
      showName: true,
      x: roomData.x,
      y: roomData.y,
      width: roomData.width,
      height: roomData.height,
      widthMeters: toMeters(roomData.width),
      heightMeters: toMeters(roomData.height),
    }
    set((state) => ({ rooms: [...state.rooms, newRoom] }))
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

  setShowName: (id, showName) => {
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room.id === id ? { ...room, showName } : room
      ),
    }))
  },
})
