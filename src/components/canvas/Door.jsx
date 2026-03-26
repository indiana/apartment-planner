import { Group, Rect, Line, Shape } from 'react-konva'
import { COLORS } from '../../constants'

export const Door = ({ door, isSelected, onSelect, onDragMove, onDragEnd, onTransformEnd }) => {
  const flip = door.flip || 1

  return (
    <Group
      id={door.id}
      x={door.x}
      y={door.y}
      rotation={door.rotation}
      scaleX={flip}
      draggable
      onClick={() => onSelect(door.id)}
      onTap={() => onSelect(door.id)}
      onDragMove={(e) => onDragMove(e, door.id)}
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
      <Shape
        sceneFunc={(context, shape) => {
          context.beginPath()
          context.arc(door.width, door.height / 2, door.width, Math.PI / 2, Math.PI, false)
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
