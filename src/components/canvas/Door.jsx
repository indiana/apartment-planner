import { Group, Rect, Line, Shape } from 'react-konva'
import { COLORS } from '../../constants'

export const Door = ({ door, isSelected, onSelect, onDragEnd, onTransformEnd }) => {
  return (
    <Group
      id={door.id}
      x={door.x}
      y={door.y}
      rotation={door.rotation}
      draggable
      onClick={() => onSelect(door.id)}
      onTap={() => onSelect(door.id)}
      onDragEnd={(e) => onDragEnd(e, door.id)}
      onTransformEnd={(e) => onTransformEnd(e, door.id)}
    >
      <Rect
        width={door.width}
        height={door.height}
        fill={COLORS.door}
        stroke={isSelected ? COLORS.primary : COLORS.door}
        strokeWidth={isSelected ? 3 : 2}
      />
      <Line
        points={[door.width, door.height / 2, door.width, door.width]}
        stroke={COLORS.door}
        strokeWidth={2}
      />
      <Shape
        sceneFunc={(context, shape) => {
          context.beginPath()
          context.arc(0, door.height / 2, door.width, 0, Math.PI / 2, false)
          context.fillStrokeShape(shape)
        }}
        stroke={COLORS.door}
        strokeWidth={1}
        dash={[4, 4]}
        opacity={0.5}
      />
    </Group>
  )
}
