import { useState, useRef, useEffect, useCallback } from 'react'
import { Stage, Layer, Rect, Line, Group, Transformer, Text, Arc, Shape } from 'react-konva'

const STORAGE_KEY = 'apartment-planner-data'
const GRID_SIZE = 20
const PIXELS_PER_METER = 100

const FURNITURE_TYPES = [
  { type: 'sofa', name: 'Sofa', width: 2, height: 0.9, color: '#6366f1' },
  { type: 'desk', name: 'Desk', width: 1.2, height: 0.6, color: '#22c55e' },
  { type: 'bed', name: 'Bed', width: 2, height: 1.6, color: '#f59e0b' },
  { type: 'chair', name: 'Chair', width: 0.5, height: 0.5, color: '#ef4444' },
  { type: 'door', name: 'Door', width: 0.9, height: 0.1, color: '#8b5cf6' },
  { type: 'window', name: 'Window', width: 1.2, height: 0.1, color: '#06b6d4' },
]

const toPixels = (meters) => meters * PIXELS_PER_METER
const toMeters = (pixels) => pixels / PIXELS_PER_METER

function App() {
  const [rooms, setRooms] = useState([])
  const [furniture, setFurniture] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [drawing, setDrawing] = useState(false)
  const [drawStart, setDrawStart] = useState(null)
  const [drawCurrent, setDrawCurrent] = useState(null)
  const [scale, setScale] = useState(1)
  const stageRef = useRef(null)
  const stageContainerRef = useRef(null)
  const transformerRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      setRooms(data.rooms || [])
      setFurniture(data.furniture || [])
    }
  }, [])

  useEffect(() => {
    if (rooms.length > 0 || furniture.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ rooms, furniture }))
    }
  }, [rooms, furniture])

  useEffect(() => {
    if (transformerRef.current && stageRef.current) {
      const stage = stageRef.current
      const selectedNode = stage.findOne(`#${selectedId}`)
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode])
        transformerRef.current.getLayer().batchDraw()
      } else {
        transformerRef.current.nodes([])
      }
    }
  }, [selectedId])

  const handleMouseDown = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage()
    const clickedOnRoom = e.target.name()?.startsWith('room')
    const clickedOnAnchor = e.target.getClassName() === 'Anchor'
    const clickedOnTransformer = e.target.getParent()?.getClassName() === 'Transformer'

    if (clickedOnEmpty) {
      if (selectedId) {
        setSelectedId(null)
      }
      const stage = stageRef.current
      if (!stage) return
      const pos = stage.getPointerPosition()
      setDrawing(true)
      setDrawStart({ x: pos.x, y: pos.y })
      setDrawCurrent({ x: pos.x, y: pos.y })
    } else if (!clickedOnAnchor && !clickedOnTransformer) {
      if (selectedId && !clickedOnRoom) {
        setSelectedId(null)
      }
    }
  }

  const handleMouseMove = (e) => {
    if (drawing && drawStart) {
      const stage = stageRef.current
      if (!stage) return
      const pos = stage.getPointerPosition()
      setDrawCurrent({ x: pos.x, y: pos.y })
    }
  }

  const handleMouseUp = () => {
    if (drawing && drawStart && drawCurrent) {
      const x = Math.min(drawStart.x, drawCurrent.x)
      const y = Math.min(drawStart.y, drawCurrent.y)
      const width = Math.abs(drawCurrent.x - drawStart.x)
      const height = Math.abs(drawCurrent.y - drawStart.y)
      
      if (width > 50 && height > 50) {
        const roomNumber = rooms.length + 1
        const newRoom = {
          id: `room-${Date.now()}`,
          name: `Room ${roomNumber}`,
          x,
          y,
          width,
          height,
          widthMeters: toMeters(width),
          heightMeters: toMeters(height),
        }
        setRooms([...rooms, newRoom])
      }
    }
    setDrawing(false)
    setDrawStart(null)
    setDrawCurrent(null)
  }

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', item.type)
    const itemType = FURNITURE_TYPES.find(t => t.type === item.type)
    
    setDraggedFurniture({
      type: item.type,
      width: toPixels(itemType.width),
      height: toPixels(itemType.height),
      color: itemType.color,
    })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const furnitureType = e.dataTransfer.getData('text/plain')
    if (!furnitureType || rooms.length === 0) return

    const itemType = FURNITURE_TYPES.find(t => t.type === furnitureType)
    if (!itemType) return

    const stage = stageRef.current
    const stageContainer = stageContainerRef.current
    if (!stage || !stageContainer) return

    const rect = stageContainer.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newFurniture = {
      id: `${furnitureType}-${Date.now()}`,
      type: furnitureType,
      x: x - toPixels(itemType.width) / 2,
      y: y - toPixels(itemType.height) / 2,
      width: toPixels(itemType.width),
      height: toPixels(itemType.height),
      rotation: 0,
      flip: 1,
    }

    setFurniture([...furniture, newFurniture])
  }

  const handleSelect = (id) => {
    setSelectedId(id)
  }

  const handleTransformEnd = (e, id) => {
    const node = e.target
    const rotation = node.rotation()
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    node.scaleX(1)
    node.scaleY(1)

    if (id.startsWith('room-')) {
      setRooms(rooms.map(room => {
        if (room.id === id) {
          return {
            ...room,
            x: node.x(),
            y: node.y(),
            width: Math.max(50, room.width * scaleX),
            height: Math.max(50, room.height * scaleY),
            widthMeters: toMeters(Math.max(50, room.width * scaleX)),
            heightMeters: toMeters(Math.max(50, room.height * scaleY)),
          }
        }
        return room
      }))
    } else {
      setFurniture(furniture.map(item => {
        if (item.id === id) {
          return {
            ...item,
            x: node.x(),
            y: node.y(),
            width: Math.max(20, item.width * scaleX),
            height: Math.max(20, item.height * scaleY),
            rotation: rotation,
          }
        }
        return item
      }))
    }
  }

  const handleDragEnd = (e, id) => {
    if (id.startsWith('room-')) {
      setRooms(rooms.map(room => {
        if (room.id === id) {
          return {
            ...room,
            x: e.target.x(),
            y: e.target.y(),
          }
        }
        return room
      }))
    } else {
      setFurniture(furniture.map(item => {
        if (item.id === id) {
          return {
            ...item,
            x: e.target.x(),
            y: e.target.y(),
          }
        }
        return item
      }))
    }
  }

  const handleDelete = useCallback(() => {
    if (selectedId) {
      if (selectedId.startsWith('room-')) {
        setRooms(rooms.filter(room => room.id !== selectedId))
        setFurniture(furniture.filter(item => item.roomId !== selectedId))
      } else {
        setFurniture(furniture.filter(item => item.id !== selectedId))
      }
      setSelectedId(null)
    }
  }, [selectedId, furniture, rooms])

  const handleRenameRoom = (newName) => {
    if (selectedId?.startsWith('room-')) {
      setRooms(rooms.map(room => {
        if (room.id === selectedId) {
          return { ...room, name: newName }
        }
        return room
      }))
    }
  }

  const handleRotate = (angle) => {
    if (selectedId) {
      setFurniture(furniture.map(item => {
        if (item.id === selectedId) {
          return { ...item, rotation: item.rotation + angle }
        }
        return item
      }))
    }
  }

  const handleFlip = () => {
    if (selectedId && !selectedId.startsWith('room-')) {
      setFurniture(furniture.map(item => {
        if (item.id === selectedId && item.type === 'door') {
          return { ...item, flip: (item.flip || 1) * -1 }
        }
        return item
      }))
    }
  }

  const handleExport = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL({ pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = 'apartment-plan.png'
      link.href = uri
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleClear = () => {
    setRooms([])
    setFurniture([])
    setSelectedId(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.3))
  }

  const handleZoomReset = () => {
    setScale(1)
  }

  const drawGrid = () => {
    const lines = []
    const canvasWidth = 1200
    const canvasHeight = 800

    for (let i = 0; i <= canvasWidth / GRID_SIZE; i++) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i * GRID_SIZE, 0, i * GRID_SIZE, canvasHeight]}
          stroke="#e5e7eb"
          strokeWidth={1}
          name="grid"
        />
      )
    }

    for (let i = 0; i <= canvasHeight / GRID_SIZE; i++) {
      lines.push(
        <Line
          key={`h-${i}`}
          points={[0, i * GRID_SIZE, canvasWidth, i * GRID_SIZE]}
          stroke="#e5e7eb"
          strokeWidth={1}
          name="grid"
        />
      )
    }

    return lines
  }

  const renderFurniture = (item) => {
    const furnitureType = FURNITURE_TYPES.find(t => t.type === item.type)
    const isSelected = selectedId === item.id

    if (item.type === 'door') {
      const doorWidth = item.width
      const doorHeight = item.height
      const doorLength = doorWidth

      return (
        <Group
          key={item.id}
          id={item.id}
          x={item.x}
          y={item.y}
          rotation={item.rotation}
          draggable
          onClick={() => handleSelect(item.id)}
          onTap={() => handleSelect(item.id)}
          onDragEnd={(e) => handleDragEnd(e, item.id)}
          onTransformEnd={(e) => handleTransformEnd(e, item.id)}
        >
          <Rect
            width={doorLength}
            height={doorHeight}
            fill={furnitureType?.color || '#8b5cf6'}
            stroke={isSelected ? '#6366f1' : '#7c3aed'}
            strokeWidth={isSelected ? 3 : 2}
          />
          <Line
            points={[doorLength, doorHeight / 2, doorLength, doorLength]}
            stroke={furnitureType?.color || '#8b5cf6'}
            strokeWidth={2}
          />
          <Shape
            sceneFunc={(context, shape) => {
              context.beginPath()
              context.arc(0, doorHeight / 2, doorLength, 0, Math.PI / 2, false)
              context.fillStrokeShape(shape)
            }}
            stroke={furnitureType?.color || '#8b5cf6'}
            strokeWidth={1}
            dash={[4, 4]}
            opacity={0.5}
          />
        </Group>
      )
    }

    if (item.type === 'window') {
      const windowWidth = item.width
      const windowHeight = item.height

      return (
        <Group
          key={item.id}
          id={item.id}
          x={item.x}
          y={item.y}
          rotation={item.rotation}
          draggable
          onClick={() => handleSelect(item.id)}
          onTap={() => handleSelect(item.id)}
          onDragEnd={(e) => handleDragEnd(e, item.id)}
          onTransformEnd={(e) => handleTransformEnd(e, item.id)}
        >
          <Rect
            width={windowWidth}
            height={windowHeight}
            fill="#e0f2fe"
            stroke={furnitureType?.color || '#06b6d4'}
            strokeWidth={isSelected ? 3 : 2}
          />
          <Line
            points={[windowWidth / 2, 0, windowWidth / 2, windowHeight]}
            stroke={furnitureType?.color || '#06b6d4'}
            strokeWidth={1}
          />
          <Line
            points={[0, windowHeight / 2, windowWidth, windowHeight / 2]}
            stroke={furnitureType?.color || '#06b6d4'}
            strokeWidth={1}
          />
        </Group>
      )
    }

    return (
      <Rect
        key={item.id}
        id={item.id}
        x={item.x}
        y={item.y}
        width={item.width}
        height={item.height}
        fill={furnitureType?.color || '#888'}
        opacity={0.8}
        rotation={item.rotation}
        draggable
        onClick={() => handleSelect(item.id)}
        onTap={() => handleSelect(item.id)}
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Apartment Planner</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={handleZoomOut}
              className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm font-medium"
            >
              −
            </button>
            <span className="px-2 text-sm text-gray-700 min-w-[50px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm font-medium"
            >
              +
            </button>
            <button
              onClick={handleZoomReset}
              className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm font-medium border-l border-gray-300"
            >
              Reset
            </button>
          </div>
          <button
            onClick={handleExport}
            disabled={rooms.length === 0}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Export PNG
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
          >
            Clear
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 bg-white border-r border-gray-200 p-4">
          <h2 className="text-sm font-medium text-gray-600 mb-3">Furniture</h2>
          <div className="space-y-2">
            {FURNITURE_TYPES.filter(t => !['door', 'window'].includes(t.type)).map((type) => (
              <div
                key={type.type}
                draggable
                onDragStart={(e) => handleDragStart(e, { type: type.type })}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-grab hover:bg-gray-100 active:cursor-grabbing border border-gray-200"
              >
                <div
                  className="flex-shrink-0"
                  style={{
                    backgroundColor: type.color,
                    width: Math.min(toPixels(type.width) / 2, 32),
                    height: Math.min(toPixels(type.height) / 2, 32),
                    borderRadius: type.type === 'sofa' ? 4 : 2,
                  }}
                />
                <div>
                  <div className="text-sm font-medium text-gray-700">{type.name}</div>
                  <div className="text-xs text-gray-500">{type.width}m × {type.height}m</div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-sm font-medium text-gray-600 mb-3 mt-6">Openings</h2>
          <div className="space-y-2">
            {FURNITURE_TYPES.filter(t => ['door', 'window'].includes(t.type)).map((type) => (
              <div
                key={type.type}
                draggable
                onDragStart={(e) => handleDragStart(e, { type: type.type })}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-grab hover:bg-gray-100 active:cursor-grabbing border border-gray-200"
              >
                <div
                  className="flex-shrink-0 border-2"
                  style={{
                    backgroundColor: type.type === 'window' ? '#e0f2fe' : type.color,
                    width: 32,
                    height: type.type === 'door' ? 16 : 12,
                    borderColor: type.color,
                    borderRadius: 2,
                  }}
                />
                <div>
                  <div className="text-sm font-medium text-gray-700">{type.name}</div>
                  <div className="text-xs text-gray-500">{type.width}m wide</div>
                </div>
              </div>
            ))}
          </div>

          {selectedId && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h2 className="text-sm font-medium text-gray-600 mb-3">Controls</h2>
              {selectedId.startsWith('room-') && (
                <div className="mb-3">
                  <label className="block text-xs text-gray-500 mb-1">Room Name</label>
                  <input
                    type="text"
                    value={rooms.find(r => r.id === selectedId)?.name || ''}
                    onChange={(e) => handleRenameRoom(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Room name"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleRotate(-90)}
                  className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                >
                  ↺ 90°
                </button>
                <button
                  onClick={() => handleRotate(90)}
                  className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                >
                  ↻ 90°
                </button>
                {furniture.find(f => f.id === selectedId)?.type === 'door' && (
                  <button
                    onClick={handleFlip}
                    className="flex-1 px-3 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm"
                    title="Flip door"
                  >
                    ⇄
                  </button>
                )}
              </div>
              <button
                onClick={handleDelete}
                className="mt-2 w-full px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm"
              >
                Delete
              </button>
            </div>
          )}

          {rooms.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h2 className="text-sm font-medium text-gray-600 mb-3">Rooms ({rooms.length})</h2>
              <div className="text-sm text-gray-700 space-y-1">
                {rooms.map((room) => {
                  const surface = (room.widthMeters * room.heightMeters).toFixed(1)
                  return (
                    <div 
                      key={room.id} 
                      className={`text-xs cursor-pointer p-1 rounded ${selectedId === room.id ? 'bg-indigo-50 text-indigo-700' : ''}`}
                      onClick={() => handleSelect(room.id)}
                    >
                      {room.name}: {room.widthMeters?.toFixed(1)}m × {room.heightMeters?.toFixed(1)}m = {surface}m²
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 pt-2 border-t border-gray-300 text-xs font-medium text-gray-800">
                Total: {rooms.reduce((sum, r) => sum + r.widthMeters * r.heightMeters, 0).toFixed(1)}m²
              </div>
            </div>
          )}
        </aside>

        <main className="flex-1 bg-gray-200 p-4 overflow-auto">
          <div
            ref={stageContainerRef}
            className="relative bg-white rounded-lg shadow-lg overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Stage
              ref={stageRef}
              width={1200}
              height={800}
              scale={{ x: scale, y: scale }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <Layer>
                {drawGrid()}
                {rooms.length === 0 && !drawing && (
                  <Text
                    x={600}
                    y={380}
                    text="Click and drag to draw rooms"
                    fontSize={20}
                    fill="#9ca3af"
                    align="center"
                  />
                )}
              </Layer>
              <Layer>
                {rooms.map((room) => (
                  <Group
                    key={room.id}
                    id={room.id}
                    x={room.x}
                    y={room.y}
                    draggable
                    onClick={() => handleSelect(room.id)}
                    onTap={() => handleSelect(room.id)}
                    onDragEnd={(e) => handleDragEnd(e, room.id)}
                    onTransformEnd={(e) => handleTransformEnd(e, room.id)}
                  >
                    <Rect
                      name="room"
                      width={room.width}
                      height={room.height}
                      fill="#f3f4f6"
                      stroke={selectedId === room.id ? '#6366f1' : '#374151'}
                      strokeWidth={4}
                      shadowColor={selectedId === room.id ? '#6366f1' : 'transparent'}
                      shadowBlur={selectedId === room.id ? 15 : 0}
                      shadowOpacity={0.4}
                    />
                    <Text
                      x={10}
                      y={room.height / 2 - 7}
                      text={room.name}
                      fontSize={14}
                      fontStyle="bold"
                      fill="#374151"
                    />
                    <Text
                      x={room.width / 2 - 15}
                      y={room.height - 15}
                      text={`${room.widthMeters?.toFixed(1)}m`}
                      fontSize={11}
                      fill="#6b7280"
                    />
                    <Text
                      x={room.width - 35}
                      y={room.height / 2 - 6}
                      text={`${room.heightMeters?.toFixed(1)}m`}
                      fontSize={11}
                      fill="#6b7280"
                    />
                  </Group>
                ))}
                {furniture.map(renderFurniture)}
                {drawing && drawStart && drawCurrent && (
                  <Rect
                    x={Math.min(drawStart.x, drawCurrent.x)}
                    y={Math.min(drawStart.y, drawCurrent.y)}
                    width={Math.abs(drawCurrent.x - drawStart.x)}
                    height={Math.abs(drawCurrent.y - drawStart.y)}
                    fill="rgba(99, 102, 241, 0.1)"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dash={[5, 5]}
                  />
                )}
                <Transformer
                  ref={transformerRef}
                  boundBoxFunc={(oldBox, newBox) => {
                    if (newBox.width < 20 || newBox.height < 20) {
                      return oldBox
                    }
                    return newBox
                  }}
                  anchorSize={8}
                  anchorCornerRadius={2}
                  borderStroke="#6366f1"
                  anchorStroke="#6366f1"
                  anchorFill="white"
                  enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right', 'top-center', 'bottom-center']}
                  keepRatio={false}
                />
              </Layer>
            </Stage>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
