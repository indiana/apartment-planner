import { Rect, Group, Text } from 'react-konva'
import { Door } from './Door'
import { Window } from './Window'
import { usePlannerStore } from '../../store/plannerStore'
import { FURNITURE_TYPES, COLORS } from '../../constants'
import { snapPosition } from '../../utils'

export const FurnitureRenderer = ({ item }) => {
  const selectedId = usePlannerStore((state) => state.selectedId)
  const select = usePlannerStore((state) => state.select)
  const updateFurniture = usePlannerStore((state) => state.updateFurniture)
  const snapToWalls = usePlannerStore((state) => state.snapToWalls)
  const rooms = usePlannerStore((state) => state.rooms)
  const furniture = usePlannerStore((state) => state.furniture)

  const furnitureType = FURNITURE_TYPES.find((t) => t.type === item.type)
  const isSelected = selectedId === item.id

  const handleDragMove = (e, id) => {
    if (!snapToWalls) return
    const node = e.target
    const snapped = snapPosition(node.x(), node.y(), item.width, item.height, rooms, furniture, id, item.roomId)
    node.position({ x: snapped.x, y: snapped.y })
  }

  const handleDragEnd = (e, id) => {
    updateFurniture(id, {
      x: e.target.x(),
      y: e.target.y(),
    })
  }

  const handleTransformEnd = (e, id) => {
    const node = e.target

    const scaleX = node.scaleX()
    const scaleY = node.scaleY()
    const newWidth = Math.max(20, node.width() * scaleX)
    const newHeight = Math.max(20, node.height() * scaleY)

    node.scaleX(1)
    node.scaleY(1)

    updateFurniture(id, {
      x: node.x(),
      y: node.y(),
      width: newWidth,
      height: newHeight,
      rotation: node.rotation(),
    })
  }

  if (item.type === 'door') {
    return (
      <Door
        door={item}
        isSelected={isSelected}
        onSelect={select}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
    )
  }

  if (item.type === 'window') {
    return (
      <Window
        window={item}
        isSelected={isSelected}
        onSelect={select}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
    )
  }

  return (
    <Group
      id={item.id}
      x={item.x}
      y={item.y}
      rotation={item.rotation}
      draggable
      onClick={() => select(item.id)}
      onTap={() => select(item.id)}
      onDragMove={(e) => handleDragMove(e, item.id)}
      onDragEnd={(e) => handleDragEnd(e, item.id)}
      onTransformEnd={(e) => handleTransformEnd(e, item.id)}
    >
      <Rect
        width={item.width}
        height={item.height}
        fill={furnitureType?.color || COLORS.furniture.chair}
        opacity={0.8}
        shadowColor="black"
        shadowBlur={isSelected ? 10 : 0}
        shadowOpacity={0.3}
        shadowEnabled={isSelected}
        cornerRadius={item.type === 'sofa' ? 8 : 2}
      />
      {item.showName && (
        <Text
          x={0}
          y={item.height / 2 - 5}
          width={item.width}
          text={item.name}
          fontSize={10}
          fill="white"
          align="center"
        />
      )}
    </Group>
  )
}
