import { Rect } from 'react-konva'
import { Door } from './Door'
import { Window } from './Window'
import { usePlannerStore } from '../../store/plannerStore'
import { FURNITURE_TYPES, COLORS } from '../../constants'

export const FurnitureRenderer = ({ item }) => {
  const selectedId = usePlannerStore((state) => state.selectedId)
  const select = usePlannerStore((state) => state.select)
  const updateFurniture = usePlannerStore((state) => state.updateFurniture)

  const furnitureType = FURNITURE_TYPES.find((t) => t.type === item.type)
  const isSelected = selectedId === item.id

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

    node.scaleX(1)
    node.scaleY(1)

    updateFurniture(id, {
      x: node.x(),
      y: node.y(),
      width: Math.max(20, item.width * scaleX),
      height: Math.max(20, item.height * scaleY),
      rotation: node.rotation(),
    })
  }

  if (item.type === 'door') {
    return (
      <Door
        door={item}
        isSelected={isSelected}
        onSelect={select}
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
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
    )
  }

  return (
    <Rect
      id={item.id}
      x={item.x}
      y={item.y}
      width={item.width}
      height={item.height}
      fill={furnitureType?.color || COLORS.furniture.chair}
      opacity={0.8}
      rotation={item.rotation}
      draggable
      onClick={() => select(item.id)}
      onTap={() => select(item.id)}
      onDragEnd={(e) => handleDragEnd(e, item.id)}
      onTransformEnd={(e) => handleTransformEnd(e, item.id)}
      shadowColor="black"
      shadowBlur={isSelected ? 10 : 0}
      shadowOpacity={0.3}
      shadowEnabled={isSelected}
      cornerRadius={item.type === 'sofa' ? 8 : 2}
    />
  )
}
