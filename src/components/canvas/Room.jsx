import { Group, Rect, Text } from 'react-konva'
import { usePlannerStore } from '../../store/plannerStore'
import { COLORS } from '../../constants'
import { formatMeters } from '../../utils'

export const Room = ({ room }) => {
  const selectedId = usePlannerStore((state) => state.selectedId)
  const select = usePlannerStore((state) => state.select)
  const updateRoom = usePlannerStore((state) => state.updateRoom)
  const isSelected = selectedId === room.id

  const handleDragEnd = (e) => {
    const oldRoom = { x: room.x, y: room.y }
    updateRoom(room.id, {
      x: e.target.x(),
      y: e.target.y(),
    }, oldRoom)
  }

  const handleTransformEnd = (e) => {
    const node = e.target

    const newWidth = Math.max(50, node.width())
    const newHeight = Math.max(50, node.height())

    node.scaleX(1)
    node.scaleY(1)
    node.width(newWidth)
    node.height(newHeight)

    const oldRoom = { x: room.x, y: room.y }
    updateRoom(room.id, {
      x: node.x(),
      y: node.y(),
      width: newWidth,
      height: newHeight,
    }, oldRoom)
  }

  return (
    <Group
      id={room.id}
      x={room.x}
      y={room.y}
      draggable
      onClick={() => select(room.id)}
      onTap={() => select(room.id)}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    >
      <Rect
        name="room"
        width={room.width}
        height={room.height}
        fill={COLORS.room.fill}
        stroke={isSelected ? COLORS.room.strokeSelected : COLORS.room.stroke}
        strokeWidth={4}
        shadowColor={isSelected ? COLORS.room.strokeSelected : 'transparent'}
        shadowBlur={isSelected ? 15 : 0}
        shadowOpacity={0.4}
      />
      <Text
        x={10}
        y={room.height / 2 - 7}
        text={room.name}
        fontSize={14}
        fontStyle="bold"
        fill={COLORS.room.text}
      />
      <Text
        x={room.width / 2 - 15}
        y={room.height - 15}
        text={`${formatMeters(room.widthMeters)}m`}
        fontSize={11}
        fill={COLORS.room.dimension}
      />
      <Text
        x={room.width - 35}
        y={room.height / 2 - 6}
        text={`${formatMeters(room.heightMeters)}m`}
        fontSize={11}
        fill={COLORS.room.dimension}
      />
    </Group>
  )
}
