import { useState, useCallback } from 'react'
import { usePlannerStore } from '../store/plannerStore'
import { LIMITS } from '../constants'

export const useDrawing = () => {
  const [drawing, setDrawing] = useState(false)
  const [drawStart, setDrawStart] = useState(null)
  const [drawCurrent, setDrawCurrent] = useState(null)
  const addRoom = usePlannerStore((state) => state.addRoom)

  const startDrawing = useCallback((position) => {
    setDrawing(true)
    setDrawStart(position)
    setDrawCurrent(position)
  }, [])

  const updateDrawing = useCallback((position) => {
    if (drawing && drawStart) {
      setDrawCurrent(position)
    }
  }, [drawing, drawStart])

  const endDrawing = useCallback(() => {
    if (drawing && drawStart && drawCurrent) {
      const x = Math.min(drawStart.x, drawCurrent.x)
      const y = Math.min(drawStart.y, drawCurrent.y)
      const width = Math.abs(drawCurrent.x - drawStart.x)
      const height = Math.abs(drawCurrent.y - drawStart.y)

      if (width > LIMITS.minDrawingSize && height > LIMITS.minDrawingSize) {
        addRoom({ x, y, width, height })
      }
    }
    setDrawing(false)
    setDrawStart(null)
    setDrawCurrent(null)
  }, [drawing, drawStart, drawCurrent, addRoom])

  const cancelDrawing = useCallback(() => {
    setDrawing(false)
    setDrawStart(null)
    setDrawCurrent(null)
  }, [])

  return {
    drawing,
    drawStart,
    drawCurrent,
    startDrawing,
    updateDrawing,
    endDrawing,
    cancelDrawing,
  }
}
