import { Rect, Line } from 'react-konva'
import { COLORS } from '../../../constants'

export const SofaRenderer = ({ item }) => {
  const w = item.width
  const h = item.height
  const backHeight = Math.min(h * 0.25, 20)
  const seatHeight = h - backHeight
  const armWidth = Math.min(w * 0.12, 15)
  const cushionGap = 4

  return (
    <>
      <Rect
        x={0}
        y={0}
        width={w}
        height={h}
        fill={COLORS.furniture.sofaBack}
        cornerRadius={6}
      />
      <Rect
        x={0}
        y={backHeight}
        width={w}
        height={seatHeight}
        fill={COLORS.furniture.sofaSeat}
        cornerRadius={[0, 0, 6, 6]}
      />
      <Rect
        x={2}
        y={2}
        width={armWidth}
        height={h - 4}
        fill={COLORS.furniture.sofaBack}
        cornerRadius={4}
      />
      <Rect
        x={w - armWidth - 2}
        y={2}
        width={armWidth}
        height={h - 4}
        fill={COLORS.furniture.sofaBack}
        cornerRadius={4}
      />
      <Line
        points={[armWidth + cushionGap, backHeight, armWidth + cushionGap, h - 2]}
        stroke={COLORS.furniture.sofaBack}
        strokeWidth={2}
      />
      <Line
        points={[w / 2, backHeight + 2, w / 2, h - 2]}
        stroke={COLORS.furniture.sofaBack}
        strokeWidth={2}
      />
      <Line
        points={[w - armWidth - cushionGap, backHeight, w - armWidth - cushionGap, h - 2]}
        stroke={COLORS.furniture.sofaBack}
        strokeWidth={2}
      />
    </>
  )
}
