import { Group, Rect, Line } from 'react-konva'
import { COLORS } from '../../constants'

export const WallOpening = ({ opening, isSelected, onSelect, onDragMove, onDragEnd, onTransformEnd }) => {
  return (
    <Group
      id={opening.id}
      x={opening.x}
      y={opening.y}
      rotation={opening.rotation}
      draggable
      onClick={() => onSelect(opening.id)}
      onTap={() => onSelect(opening.id)}
      onDragMove={(e) => onDragMove(e, opening.id)}
      onDragEnd={(e) => onDragEnd(e, opening.id)}
      onTransformEnd={(e) => onTransformEnd(e, opening.id)}
    >
      <Rect
        width={opening.width}
        height={opening.height}
        fill={COLORS.room.stroke}
        stroke={isSelected ? COLORS.room.strokeSelected : COLORS.room.stroke}
        strokeWidth={isSelected ? 3 : 0}
      />
      <Line
        points={[0, opening.height / 2, opening.width, opening.height / 2]}
        stroke={COLORS.room.fill}
        strokeWidth={2}
        dash={[4, 4]}
      />
    </Group>
  )
}
