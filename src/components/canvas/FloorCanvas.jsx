import { useRef, useEffect } from 'react'
import { Stage, Layer, Line, Text, Transformer, Rect } from 'react-konva'
import { usePlannerStore } from '../../store'
import { Room } from './Room'
import { FurnitureRenderer } from './FurnitureRenderer'
import { DrawingPreview } from './DrawingPreview'
import { GRID_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT, COLORS, LIMITS, TRANSFORMER_CONFIG } from '../../constants'
import { isCanvasClick, isAnchorClick, isTransformerClick, isRoomElement } from '../../utils'

export const FloorCanvas = ({
  scale,
  drawing,
  drawStart,
  drawCurrent,
  startDrawing,
  updateDrawing,
  endDrawing,
  stageRef,
}) => {
  const transformerRef = useRef(null)
  const rooms = usePlannerStore((state) => state.rooms)
  const furniture = usePlannerStore((state) => state.furniture)
  const selectedId = usePlannerStore((state) => state.selectedId)
  const deselect = usePlannerStore((state) => state.deselect)
  const select = usePlannerStore((state) => state.select)
  const roomsLocked = usePlannerStore((state) => state.roomsLocked)

  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return

    const stage = stageRef.current
    const selectedNode = stage.findOne(`#${selectedId}`)

    if (selectedNode) {
      const selectedItem = furniture.find(f => f.id === selectedId)
      const isRoom = selectedId?.startsWith('room-')
      const isOpening = selectedItem && ['door', 'window', 'passage'].includes(selectedItem.type)

      if (isRoom && roomsLocked) {
        transformerRef.current.nodes([])
      } else {
        transformerRef.current.enabledAnchors(isOpening
          ? ['middle-left', 'middle-right']
          : [
              'top-left', 'top-right', 'bottom-left', 'bottom-right',
              'middle-left', 'middle-right', 'top-center', 'bottom-center'
            ]
        )
        transformerRef.current.rotateEnabled(!isOpening)
        transformerRef.current.nodes([selectedNode])
        transformerRef.current.getLayer().batchDraw()
      }
    } else {
      transformerRef.current.nodes([])
    }
  }, [selectedId, stageRef, furniture, roomsLocked])

  useEffect(() => {
    if (roomsLocked && selectedId?.startsWith('room-')) {
      deselect()
    }
  }, [roomsLocked, selectedId, deselect])

  const handleMouseDown = (e) => {
    const clickedOnEmpty = isCanvasClick(e)
    const clickedOnRoom = isRoomElement(e)
    const clickedOnAnchor = isAnchorClick(e)
    const clickedOnTransformer = isTransformerClick(e)

    if (clickedOnEmpty) {
      deselect()
      if (!roomsLocked) {
        const stage = stageRef.current
        if (!stage) return
        const pos = stage.getPointerPosition()
        startDrawing(pos)
      }
    } else if (!clickedOnAnchor && !clickedOnTransformer) {
      const id = e.target.id()
      if (id && id !== selectedId && !clickedOnRoom) {
        select(id)
      } else if (selectedId && !clickedOnRoom) {
        deselect()
      }
    }
  }

  const handleMouseMove = () => {
    if (drawing) {
      const stage = stageRef.current
      if (!stage) return
      const pos = stage.getPointerPosition()
      updateDrawing(pos)
    }
  }

  const handleMouseUp = () => {
    if (drawing) {
      endDrawing()
    }
  }

  const drawGrid = () => {
    const lines = []

    for (let i = 0; i <= CANVAS_WIDTH / GRID_SIZE; i++) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i * GRID_SIZE, 0, i * GRID_SIZE, CANVAS_HEIGHT]}
          stroke={COLORS.grid}
          strokeWidth={1}
          name="grid"
        />
      )
    }

    for (let i = 0; i <= CANVAS_HEIGHT / GRID_SIZE; i++) {
      lines.push(
        <Line
          key={`h-${i}`}
          points={[0, i * GRID_SIZE, CANVAS_WIDTH, i * GRID_SIZE]}
          stroke={COLORS.grid}
          strokeWidth={1}
          name="grid"
        />
      )
    }

    return lines
  }

  return (
    <Stage
      ref={stageRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      scale={{ x: scale, y: scale }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>
        <Rect
          x={0}
          y={0}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          fill="white"
          listening={false}
        />
        {drawGrid()}
        {rooms.length === 0 && !drawing && (
          <Text
            x={CANVAS_WIDTH / 2}
            y={CANVAS_HEIGHT / 2}
            text="Click and drag to draw rooms"
            fontSize={20}
            fill="#9ca3af"
            align="center"
            offsetX={100}
          />
        )}
      </Layer>
      <Layer>
        {rooms.map((room) => (
          <Room key={room.id} room={room} />
        ))}
        {furniture.map((item) => (
          <FurnitureRenderer key={item.id} item={item} />
        ))}
        <DrawingPreview drawStart={drawStart} drawCurrent={drawCurrent} />
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < LIMITS.minFurnitureSize) {
              return oldBox
            }
            return newBox
          }}
          anchorSize={TRANSFORMER_CONFIG.anchorSize}
          anchorCornerRadius={TRANSFORMER_CONFIG.anchorCornerRadius}
          borderStroke={TRANSFORMER_CONFIG.borderStroke}
          anchorStroke={TRANSFORMER_CONFIG.anchorStroke}
          anchorFill={TRANSFORMER_CONFIG.anchorFill}
          enabledAnchors={TRANSFORMER_CONFIG.enabledAnchors}
          keepRatio={TRANSFORMER_CONFIG.keepRatio}
        />
      </Layer>
    </Stage>
  )
}
