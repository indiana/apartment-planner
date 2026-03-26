import { Rect, Group, Text } from 'react-konva'
import { Door } from './Door'
import { Window } from './Window'
import { WallOpening } from './WallOpening'
import { BedRenderer, SofaRenderer, DeskRenderer, ChairRenderer } from './items'
import { usePlannerStore } from '../../store'
import { useSnap } from '../../hooks/useSnap'

const RENDERERS = {
  bed: BedRenderer,
  sofa: SofaRenderer,
  desk: DeskRenderer,
  chair: ChairRenderer,
}

export const FurnitureRenderer = ({ item }) => {
  const selectedId = usePlannerStore((s) => s.selectedId)
  const select = usePlannerStore((s) => s.select)
  const updateFurniture = usePlannerStore((s) => s.updateFurniture)
  const { snapPosition } = useSnap()

  const isSelected = selectedId === item.id

  const handleDragMove = (e, id) => {
    const node = e.target
    const snapped = snapPosition(node.x(), node.y(), item.width, item.height, id, item.roomId)
    node.position({ x: snapped.x, y: snapped.y })
  }

  const handleDragEnd = (e, id) => {
    updateFurniture(id, { x: e.target.x(), y: e.target.y() })
  }

  const handleTransformEnd = (e, id) => {
    const node = e.target
    const isOpening = ['door', 'window', 'passage'].includes(item.type)
    const scaleX = node.scaleX()
    const newWidth = Math.max(20, item.width * scaleX)
    const newHeight = isOpening ? item.height : Math.max(20, item.height * node.scaleY())

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

  if (item.type === 'passage') {
    return (
      <WallOpening
        opening={item}
        isSelected={isSelected}
        onSelect={select}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
    )
  }

  const DetailRenderer = RENDERERS[item.type]

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
        fill="transparent"
        shadowColor="black"
        shadowBlur={isSelected ? 10 : 0}
        shadowOpacity={0.3}
        shadowEnabled={isSelected}
      />
      {DetailRenderer && <DetailRenderer item={item} />}
      {item.showName && (
        <Text
          x={0}
          y={item.height / 2 - 5}
          width={item.width}
          text={item.name}
          fontSize={10}
          fill="white"
          align="center"
          listening={false}
        />
      )}
    </Group>
  )
}
