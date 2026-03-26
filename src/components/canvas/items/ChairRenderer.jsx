import { Rect, Line } from 'react-konva'
import { COLORS } from '../../../constants'

export const ChairRenderer = ({ item }) => {
  const w = item.width
  const h = item.height
  const backHeight = Math.min(h * 0.35, 18)
  const seatHeight = h - backHeight
  const seatPadding = 4

  return (
    <>
      <Rect
        x={0}
        y={0}
        width={w}
        height={h}
        fill={COLORS.furniture.chairBack}
        cornerRadius={4}
      />
      <Rect
        x={seatPadding}
        y={backHeight}
        width={w - seatPadding * 2}
        height={seatHeight}
        fill={COLORS.furniture.chairSeat}
        cornerRadius={[0, 0, 4, 4]}
      />
      <Line
        points={[seatPadding, backHeight, w - seatPadding, backHeight]}
        stroke={COLORS.furniture.chairBack}
        strokeWidth={2}
      />
    </>
  )
}
