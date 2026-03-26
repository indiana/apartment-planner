import { useCallback } from 'react'
import { usePlannerStore } from '../store'
import { snapPosition as snapPosition_, snapRoomPosition as snapRoomPosition_ } from '../utils'

export const useSnap = () => {
  const snapToWalls = usePlannerStore((s) => s.snapToWalls)
  const rooms = usePlannerStore((s) => s.rooms)
  const furniture = usePlannerStore((s) => s.furniture)

  const snapPosition = useCallback((x, y, width, height, itemId, roomId) => {
    if (!snapToWalls) return { x, y }
    return snapPosition_(x, y, width, height, rooms, furniture, itemId, roomId)
  }, [snapToWalls, rooms, furniture])

  const snapRoomPosition = useCallback((x, y, width, height, roomId) => {
    if (!snapToWalls) return { x, y }
    return snapRoomPosition_(x, y, width, height, rooms, roomId)
  }, [snapToWalls, rooms])

  return { snapPosition, snapRoomPosition }
}
