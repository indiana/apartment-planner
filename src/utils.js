import { PIXELS_PER_METER, GRID_SIZE } from './constants'

export const toPixels = (meters) => meters * PIXELS_PER_METER

export const toMeters = (pixels) => pixels / PIXELS_PER_METER

export const generateId = (prefix) => `${prefix}-${Date.now()}`

export const SNAP_THRESHOLD = GRID_SIZE * 2

export const ROOM_SNAP_THRESHOLD = GRID_SIZE * 3

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

export const getFurnitureEdges = (furniture, excludeId) => {
  const edges = { left: [], right: [], top: [], bottom: [] }
  furniture.forEach((item) => {
    if (item.id === excludeId) return
    edges.left.push(item.x)
    edges.right.push(item.x + item.width)
    edges.top.push(item.y)
    edges.bottom.push(item.y + item.height)
  })
  return edges
}

export const getRoomEdges = (rooms, roomId) => {
  const edges = { left: [], right: [], top: [], bottom: [] }
  rooms.forEach((room) => {
    if (room.id === roomId) return
    edges.left.push(room.x)
    edges.right.push(room.x + room.width)
    edges.top.push(room.y)
    edges.bottom.push(room.y + room.height)
  })
  return edges
}

export const snapPosition = (x, y, width, height, rooms, furniture, itemId, roomId) => {
  let snappedX = x
  let snappedY = y
  const threshold = SNAP_THRESHOLD

  const roomEdges = getRoomEdges(rooms, roomId)
  const furnitureEdges = getFurnitureEdges(furniture, itemId)

  const leftEdges = [...roomEdges.left, ...furnitureEdges.left, 0]
  const rightEdges = [...roomEdges.right, ...furnitureEdges.right]
  const topEdges = [...roomEdges.top, ...furnitureEdges.top, 0]
  const bottomEdges = [...roomEdges.bottom, ...furnitureEdges.bottom]

  for (const edge of leftEdges) {
    if (Math.abs(x - edge) < threshold) {
      snappedX = edge
      break
    }
    if (Math.abs(x + width - edge) < threshold) {
      snappedX = edge - width
      break
    }
  }

  for (const edge of rightEdges) {
    if (Math.abs(x + width - edge) < threshold) {
      snappedX = edge - width
      break
    }
  }

  for (const edge of topEdges) {
    if (Math.abs(y - edge) < threshold) {
      snappedY = edge
      break
    }
    if (Math.abs(y + height - edge) < threshold) {
      snappedY = edge - height
      break
    }
  }

  for (const edge of bottomEdges) {
    if (Math.abs(y + height - edge) < threshold) {
      snappedY = edge - height
      break
    }
  }

  return { x: snappedX, y: snappedY }
}

export const snapRoomPosition = (x, y, width, height, rooms, excludeId) => {
  let snappedX = x
  let snappedY = y
  const threshold = ROOM_SNAP_THRESHOLD

  const otherRooms = rooms.filter(r => r.id !== excludeId)

  const leftEdges = otherRooms.map(r => r.x)
  const rightEdges = otherRooms.map(r => r.x + r.width)
  const topEdges = otherRooms.map(r => r.y)
  const bottomEdges = otherRooms.map(r => r.y + r.height)

  for (const edge of leftEdges) {
    if (Math.abs(x - edge) < threshold) {
      snappedX = edge
      break
    }
    if (Math.abs(x + width - edge) < threshold) {
      snappedX = edge - width
      break
    }
  }

  for (const edge of rightEdges) {
    if (Math.abs(x + width - edge) < threshold) {
      snappedX = edge - width
      break
    }
  }

  for (const edge of topEdges) {
    if (Math.abs(y - edge) < threshold) {
      snappedY = edge
      break
    }
    if (Math.abs(y + height - edge) < threshold) {
      snappedY = edge - height
      break
    }
  }

  for (const edge of bottomEdges) {
    if (Math.abs(y + height - edge) < threshold) {
      snappedY = edge - height
      break
    }
  }

  return { x: snappedX, y: snappedY }
}
