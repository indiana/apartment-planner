import { STORAGE_KEY } from '../../constants'

export const uiSlice = (set, get) => ({
  selectedId: null,
  snapToWalls: false,
  roomsLocked: false,

  toggleSnapToWalls: () => {
    set((state) => ({ snapToWalls: !state.snapToWalls }))
  },

  toggleRoomsLocked: () => {
    set((state) => ({ roomsLocked: !state.roomsLocked }))
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
    return get().selectedId?.startsWith('room-') || false
  },

  isSelectedDoor: () => {
    const { selectedId, furniture } = get()
    const item = furniture.find((f) => f.id === selectedId)
    return item?.type === 'door' || false
  },

  isSelectedOpening: () => {
    const { selectedId, furniture } = get()
    const item = furniture.find((f) => f.id === selectedId)
    return item?.type === 'door' || item?.type === 'window' || item?.type === 'passage' || false
  },
})

export const persistConfig = {
  name: STORAGE_KEY,
  partialize: (state) => ({
    rooms: state.rooms,
    furniture: state.furniture,
    snapToWalls: state.snapToWalls,
    roomsLocked: state.roomsLocked,
  }),
}
