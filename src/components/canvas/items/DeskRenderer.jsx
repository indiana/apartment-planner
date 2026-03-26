import { Rect, Line } from 'react-konva'
import { COLORS } from '../../../constants'

export const DeskRenderer = ({ item }) => {
  const w = item.width
  const h = item.height
  const padding = 8
  const screenWidth = w * 0.5
  const screenHeight = h * 0.45
  const screenX = (w - screenWidth) / 2
  const screenY = padding + 4
  const keyboardWidth = w * 0.5
  const keyboardHeight = h * 0.15
  const keyboardX = (w - keyboardWidth) / 2
  const keyboardY = h - padding - keyboardHeight - 6
  const mouseWidth = 14
  const mouseHeight = 20
  const mouseX = w - padding - mouseWidth - 4
  const mouseY = keyboardY + (keyboardHeight - mouseHeight) / 2

  return (
    <>
      <Rect
        x={0}
        y={0}
        width={w}
        height={h}
        fill={COLORS.furniture.deskLegs}
        cornerRadius={2}
      />
      <Rect
        x={padding}
        y={padding}
        width={w - padding * 2}
        height={h - padding * 2}
        fill={COLORS.furniture.deskTop}
        cornerRadius={2}
      />
      <Rect
        x={screenX}
        y={screenY}
        width={screenWidth}
        height={screenHeight}
        fill={COLORS.furniture.deskLegs}
        cornerRadius={3}
      />
      <Rect
        x={screenX + 4}
        y={screenY + 4}
        width={screenWidth - 8}
        height={screenHeight - 8}
        fill="#1f2937"
        cornerRadius={2}
      />
      <Rect
        x={keyboardX}
        y={keyboardY}
        width={keyboardWidth}
        height={keyboardHeight}
        fill={COLORS.furniture.deskLegs}
        cornerRadius={3}
      />
      <Line
        points={[
          keyboardX + 6, keyboardY + keyboardHeight * 0.35,
          keyboardX + keyboardWidth - 6, keyboardY + keyboardHeight * 0.35,
        ]}
        stroke={COLORS.furniture.deskTop}
        strokeWidth={2}
        opacity={0.6}
      />
      <Line
        points={[
          keyboardX + 6, keyboardY + keyboardHeight * 0.65,
          keyboardX + keyboardWidth * 0.5, keyboardY + keyboardHeight * 0.65,
        ]}
        stroke={COLORS.furniture.deskTop}
        strokeWidth={2}
        opacity={0.6}
      />
      <Rect
        x={mouseX}
        y={mouseY}
        width={mouseWidth}
        height={mouseHeight}
        fill={COLORS.furniture.deskLegs}
        cornerRadius={4}
      />
      <Line
        points={[mouseX + mouseWidth / 2, mouseY + 3, mouseX + mouseWidth / 2, mouseY + mouseHeight - 3]}
        stroke={COLORS.furniture.deskTop}
        strokeWidth={1}
        opacity={0.6}
      />
    </>
  )
}
