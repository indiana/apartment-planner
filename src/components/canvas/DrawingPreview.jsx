import { Rect } from 'react-konva'
import { COLORS } from '../../constants'

export const DrawingPreview = ({ drawStart, drawCurrent }) => {
  if (!drawStart || !drawCurrent) return null

  const x = Math.min(drawStart.x, drawCurrent.x)
  const y = Math.min(drawStart.y, drawCurrent.y)
  const width = Math.abs(drawCurrent.x - drawStart.x)
  const height = Math.abs(drawCurrent.y - drawStart.y)

  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={COLORS.drawingPreview}
      stroke={COLORS.primary}
      strokeWidth={2}
      dash={[5, 5]}
    />
  )
}
