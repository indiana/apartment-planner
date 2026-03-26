import { Group, Rect, Text } from 'react-konva'
import { usePlannerStore } from '../../store/plannerStore'
import { COLORS } from '../../constants'
import { formatMeters, snapRoomPosition } from '../../utils'

export const Room = ({ room }) => {
  const selectedId = usePlannerStore((state) => state.selectedId)
  const select = usePlannerStore((state) => state.select)
  const updateRoom = usePlannerStore((state) => state.updateRoom)
  const snapToWalls = usePlannerStore((state) => state.snapToWalls)
  const rooms = usePlannerStore((state) => state.rooms)
  const isSelected = selectedId === room.id

  const handleDragMove = (e) => {
    if (!snapToWalls) return
    const node = e.target
    const snapped = snapRoomPosition(node.x(), node.y(), room.width, room.height, rooms, room.id)
    node.position({ x: snapped.x, y: snapped.y })
  }

  const handleDragEnd = (e) => {
    const oldRoom = { x: room.x, y: room.y }
    updateRoom(room.id, {
      x: e.target.x(),
      y: e.target.y(),
    }, oldRoom)
  }

  const handleTransformEnd = (e) => {
    const node = e.target
    const layer = node.getLayer()

    const scaleX = node.scaleX()
    const scaleY = node.scaleY()
    const newWidth = Math.max(50, room.width * scaleX)
    const newHeight = Math.max(50, room.height * scaleY)

    const oldRoom = { x: room.x, y: room.y }
    updateRoom(room.id, {
      x: node.x(),
      y: node.y(),
      width: newWidth,
      height: newHeight,
    }, oldRoom)

    setTimeout(() => {
      node.scaleX(1)
      node.scaleY(1)
      layer?.batchDraw()
    }, 0)
  }

  return (
    <Group
      id={room.id}
      x={room.x}
      y={room.y}
      draggable
      onClick={() => select(room.id)}
      onTap={() => select(room.id)}
      onDragMove={handleDragMove}
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
      {room.showName && (
        <Text
          x={10}
          y={room.height / 2 - 7}
          text={room.name}
          fontSize={14}
          fontStyle="bold"
          fill={COLORS.room.text}
        />
      )}
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
