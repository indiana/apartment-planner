import { Group, Rect, Line } from 'react-konva'
import { COLORS } from '../../constants'

export const Window = ({ window, isSelected, onSelect, onDragMove, onDragEnd, onTransformEnd }) => {
  return (
    <Group
      id={window.id}
      x={window.x}
      y={window.y}
      rotation={window.rotation}
      draggable
      onClick={() => onSelect(window.id)}
      onTap={() => onSelect(window.id)}
      onDragMove={(e) => onDragMove(e, window.id)}
      onDragEnd={(e) => onDragEnd(e, window.id)}
      onTransformEnd={(e) => onTransformEnd(e, window.id)}
    >
      <Rect
        width={window.width}
        height={window.height}
        fill={COLORS.windowFill}
        stroke={isSelected ? COLORS.primary : COLORS.window}
        strokeWidth={isSelected ? 3 : 2}
      />
      <Line
        points={[window.width / 2, 0, window.width / 2, window.height]}
        stroke={COLORS.window}
        strokeWidth={1}
      />
      <Line
        points={[0, window.height / 2, window.width, window.height / 2]}
        stroke={COLORS.window}
        strokeWidth={1}
      />
    </Group>
  )
}
