import { PIXELS_PER_METER } from './constants'

export const toPixels = (meters) => meters * PIXELS_PER_METER

export const toMeters = (pixels) => pixels / PIXELS_PER_METER

export const generateId = (prefix) => `${prefix}-${Date.now()}`

export const calculateSurface = (room) => {
  const surface = room.widthMeters * room.heightMeters
  return surface.toFixed(1)
}

export const formatMeters = (value) => value?.toFixed(1) ?? '0.0'

export const formatSurface = (widthMeters, heightMeters) => {
  const w = formatMeters(widthMeters)
  const h = formatMeters(heightMeters)
  const surface = (widthMeters * heightMeters).toFixed(1)
  return `${w}m × ${h}m = ${surface}m²`
}

export const getTotalSurface = (rooms) => {
  return rooms.reduce((sum, r) => sum + r.widthMeters * r.heightMeters, 0).toFixed(1)
}

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export const isRoomId = (id) => id?.startsWith('room-')

export const findItemById = (items, id) => items.find(item => item.id === id)

export const isCanvasClick = (e) => e.target === e.target.getStage()

export const isAnchorClick = (e) => e.target.getClassName() === 'Anchor'

export const isTransformerClick = (e) => e.target.getParent()?.getClassName() === 'Transformer'

export const isRoomElement = (e) => e.target.name()?.startsWith('room')

export const findRoomAtPoint = (rooms, x, y) => {
  return rooms.find((room) =>
    x >= room.x &&
    x <= room.x + room.width &&
    y >= room.y &&
    y <= room.y + room.height
  )
}
