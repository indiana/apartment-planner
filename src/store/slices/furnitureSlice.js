import { generateId } from '../../utils'
import { FURNITURE_TYPES } from '../../constants'

export const furnitureSlice = (set, get) => ({
  furniture: [],

  addFurniture: (furnitureData) => {
    const existing = get().furniture
    const typeName = FURNITURE_TYPES.find(t => t.type === furnitureData.type)?.name ||
      furnitureData.type.charAt(0).toUpperCase() + furnitureData.type.slice(1)
    const countOfType = existing.filter(f => f.type === furnitureData.type).length + 1
    const newFurniture = {
      id: generateId(furnitureData.type),
      name: `${typeName} ${countOfType}`,
      showName: true,
      ...furnitureData,
    }
    set((state) => ({ furniture: [...state.furniture, newFurniture] }))
    return newFurniture.id
  },

  updateFurniture: (id, updates) => {
    set((state) => ({
      furniture: state.furniture.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }))
  },

  renameFurniture: (id, name) => {
    set((state) => ({
      furniture: state.furniture.map((item) =>
        item.id === id ? { ...item, name } : item
      ),
    }))
  },

  deleteFurniture: (id) => {
    set((state) => ({
      furniture: state.furniture.filter((item) => item.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }))
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
})
