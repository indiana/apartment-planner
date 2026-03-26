import { Rect, Line } from 'react-konva'
import { COLORS } from '../../../constants'

export const BedRenderer = ({ item }) => {
  const w = item.width
  const h = item.height
  const frameWidth = 8
  const pillowHeight = Math.min(h * 0.18, 22)
  const footSpace = frameWidth + 4
  const coverTop = frameWidth + pillowHeight + 4
  const coverBottom = h - footSpace

  return (
    <>
      <Rect
        x={0}
        y={0}
        width={w}
        height={h}
        fill={COLORS.furniture.bedFrame}
        cornerRadius={3}
      />
      <Rect
        x={frameWidth}
        y={coverTop}
        width={w - frameWidth * 2}
        height={coverBottom - coverTop}
        fill={COLORS.furniture.bedCover}
        cornerRadius={2}
      />
      <Rect
        x={frameWidth}
        y={frameWidth}
        width={w - frameWidth * 2}
        height={pillowHeight}
        fill={COLORS.furniture.bedPillow}
        cornerRadius={4}
      />
      <Line
        points={[frameWidth + 4, frameWidth + pillowHeight * 0.4, w - frameWidth - 4, frameWidth + pillowHeight * 0.4]}
        stroke="white"
        strokeWidth={1}
        opacity={0.5}
      />
      <Rect
        x={w * 0.1}
        y={coverTop + 5}
        width={w * 0.35}
        height={(coverBottom - coverTop - 10) * 0.55}
        fill={COLORS.furniture.bedSheet}
        cornerRadius={2}
        opacity={0.6}
      />
      <Rect
        x={w * 0.5}
        y={coverTop + 5}
        width={w * 0.35}
        height={(coverBottom - coverTop - 10) * 0.55}
        fill={COLORS.furniture.bedSheet}
        cornerRadius={2}
        opacity={0.6}
      />
    </>
  )
}
