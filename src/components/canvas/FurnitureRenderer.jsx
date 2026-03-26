import { Rect, Group, Text, Line, Circle } from 'react-konva'
import { Door } from './Door'
import { Window } from './Window'
import { WallOpening } from './WallOpening'
import { usePlannerStore } from '../../store/plannerStore'
import { FURNITURE_TYPES, COLORS } from '../../constants'
import { snapPosition } from '../../utils'

const BedRenderer = ({ item }) => {
  const w = item.width
  const h = item.height
  const frameWidth = 8
  const pillowHeight = Math.min(h * 0.18, 22)
  const footSpace = frameWidth + 4
  const coverTop = frameWidth + pillowHeight + 4
  const coverBottom = h - footSpace

  return (
    <>
      <Rect
        x={0}
        y={0}
        width={w}
        height={h}
        fill={COLORS.furniture.bedFrame}
        cornerRadius={3}
      />
      <Rect
        x={frameWidth}
        y={coverTop}
        width={w - frameWidth * 2}
        height={coverBottom - coverTop}
        fill={COLORS.furniture.bedCover}
        cornerRadius={2}
      />
      <Rect
        x={frameWidth}
        y={frameWidth}
        width={w - frameWidth * 2}
        height={pillowHeight}
        fill={COLORS.furniture.bedPillow}
        cornerRadius={4}
      />
      <Line
        points={[frameWidth + 4, frameWidth + pillowHeight * 0.4, w - frameWidth - 4, frameWidth + pillowHeight * 0.4]}
        stroke="white"
        strokeWidth={1}
        opacity={0.5}
      />
      <Rect
        x={w * 0.1}
        y={coverTop + 5}
        width={w * 0.35}
        height={(coverBottom - coverTop - 10) * 0.55}
        fill={COLORS.furniture.bedSheet}
        cornerRadius={2}
        opacity={0.6}
      />
      <Rect
        x={w * 0.5}
        y={coverTop + 5}
        width={w * 0.35}
        height={(coverBottom - coverTop - 10) * 0.55}
        fill={COLORS.furniture.bedSheet}
        cornerRadius={2}
        opacity={0.6}
      />
    </>
  )
}

const SofaRenderer = ({ item }) => {
  const w = item.width
  const h = item.height
  const backHeight = Math.min(h * 0.25, 20)
  const seatHeight = h - backHeight
  const armWidth = Math.min(w * 0.12, 15)
  const cushionGap = 4

  return (
    <>
      <Rect
        x={0}
        y={0}
        width={w}
        height={h}
        fill={COLORS.furniture.sofaBack}
        cornerRadius={6}
      />
      <Rect
        x={0}
        y={backHeight}
        width={w}
        height={seatHeight}
        fill={COLORS.furniture.sofaSeat}
        cornerRadius={[0, 0, 6, 6]}
      />
      <Rect
        x={2}
        y={2}
        width={armWidth}
        height={h - 4}
        fill={COLORS.furniture.sofaBack}
        cornerRadius={4}
      />
      <Rect
        x={w - armWidth - 2}
        y={2}
        width={armWidth}
        height={h - 4}
        fill={COLORS.furniture.sofaBack}
        cornerRadius={4}
      />
      <Line
        points={[armWidth + cushionGap, backHeight, armWidth + cushionGap, h - 2]}
        stroke={COLORS.furniture.sofaBack}
        strokeWidth={2}
      />
      <Line
        points={[w / 2, backHeight + 2, w / 2, h - 2]}
        stroke={COLORS.furniture.sofaBack}
        strokeWidth={2}
      />
      <Line
        points={[w - armWidth - cushionGap, backHeight, w - armWidth - cushionGap, h - 2]}
        stroke={COLORS.furniture.sofaBack}
        strokeWidth={2}
      />
    </>
  )
}

const DeskRenderer = ({ item }) => {
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

const ChairRenderer = ({ item }) => {
  const w = item.width
  const h = item.height
  const backHeight = Math.min(h * 0.35, 18)
  const seatHeight = h - backHeight
  const seatPadding = 4

  return (
    <>
      <Rect
        x={0}
        y={0}
        width={w}
        height={h}
        fill={COLORS.furniture.chairBack}
        cornerRadius={4}
      />
      <Rect
        x={seatPadding}
        y={backHeight}
        width={w - seatPadding * 2}
        height={seatHeight}
        fill={COLORS.furniture.chairSeat}
        cornerRadius={[0, 0, 4, 4]}
      />
      <Line
        points={[seatPadding, backHeight, w - seatPadding, backHeight]}
        stroke={COLORS.furniture.chairBack}
        strokeWidth={2}
      />
    </>
  )
}

export const FurnitureRenderer = ({ item }) => {
  const selectedId = usePlannerStore((state) => state.selectedId)
  const select = usePlannerStore((state) => state.select)
  const updateFurniture = usePlannerStore((state) => state.updateFurniture)
  const snapToWalls = usePlannerStore((state) => state.snapToWalls)
  const rooms = usePlannerStore((state) => state.rooms)
  const furniture = usePlannerStore((state) => state.furniture)

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

  const renderFurnitureDetail = () => {
    switch (item.type) {
      case 'bed':
        return <BedRenderer item={item} isSelected={isSelected} />
      case 'sofa':
        return <SofaRenderer item={item} isSelected={isSelected} />
      case 'desk':
        return <DeskRenderer item={item} isSelected={isSelected} />
      case 'chair':
        return <ChairRenderer item={item} isSelected={isSelected} />
      default:
        return null
    }
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
        fill="transparent"
        shadowColor="black"
        shadowBlur={isSelected ? 10 : 0}
        shadowOpacity={0.3}
        shadowEnabled={isSelected}
      />
      {renderFurnitureDetail()}
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
