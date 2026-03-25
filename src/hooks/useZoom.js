import { useState, useCallback } from 'react'
import { ZOOM_MIN, ZOOM_MAX, ZOOM_STEP, ZOOM_DEFAULT } from '../constants'
import { clamp } from '../utils'

export const useZoom = () => {
  const [scale, setScale] = useState(ZOOM_DEFAULT)

  const zoomIn = useCallback(() => {
    setScale((prev) => clamp(prev + ZOOM_STEP, ZOOM_MIN, ZOOM_MAX))
  }, [])

  const zoomOut = useCallback(() => {
    setScale((prev) => clamp(prev - ZOOM_STEP, ZOOM_MIN, ZOOM_MAX))
  }, [])

  const zoomReset = useCallback(() => {
    setScale(ZOOM_DEFAULT)
  }, [])

  const setZoom = useCallback((value) => {
    setScale(clamp(value, ZOOM_MIN, ZOOM_MAX))
  }, [])

  return {
    scale,
    zoomIn,
    zoomOut,
    zoomReset,
    setZoom,
  }
}
