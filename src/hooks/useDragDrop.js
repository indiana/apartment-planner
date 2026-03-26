import { useCallback } from 'react'
import { usePlannerStore } from '../store'
import { toPixels, findRoomAtPoint } from '../utils'
import { FURNITURE_TYPES, OPENING_TYPES, WALL_OPENING_TYPES } from '../constants'

export const useDragDrop = (stageContainerRef) => {
  const rooms = usePlannerStore((s) => s.rooms)
  const addFurniture = usePlannerStore((s) => s.addFurniture)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const furnitureType = e.dataTransfer.getData('text/plain')
    if (!furnitureType) return

    const itemType = FURNITURE_TYPES.find((t) => t.type === furnitureType) ||
                      OPENING_TYPES.find((t) => t.type === furnitureType) ||
                      WALL_OPENING_TYPES.find((t) => t.type === furnitureType)
    if (!itemType) return

    const stageContainer = stageContainerRef?.current
    if (!stageContainer) return

    const rect = stageContainer.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const targetRoom = findRoomAtPoint(rooms, x, y)

    addFurniture({
      type: furnitureType,
      x: x - toPixels(itemType.width) / 2,
      y: y - toPixels(itemType.height) / 2,
      width: toPixels(itemType.width),
      height: toPixels(itemType.height),
      rotation: 0,
      flip: 1,
      roomId: targetRoom?.id || null,
    })
  }, [stageContainerRef, rooms, addFurniture])

  return { handleDragOver, handleDrop }
}
