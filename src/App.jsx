import { useRef } from 'react'
import { usePlannerStore } from './store/plannerStore'
import { useDrawing, useExport } from './hooks'
import { FloorCanvas } from './components/canvas'
import { Header, Sidebar } from './components/ui'
import { FURNITURE_TYPES } from './constants'
import { toPixels, findRoomAtPoint } from './utils'

function App() {
  const stageRef = useRef(null)
  const stageContainerRef = useRef(null)
  const rooms = usePlannerStore((state) => state.rooms)
  const addFurniture = usePlannerStore((state) => state.addFurniture)
  const clearAll = usePlannerStore((state) => state.clearAll)

  const {
    drawing,
    drawStart,
    drawCurrent,
    startDrawing,
    updateDrawing,
    endDrawing,
  } = useDrawing()

  const { exportAsPng } = useExport(stageRef)

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const furnitureType = e.dataTransfer.getData('text/plain')
    if (!furnitureType) return

    const itemType = FURNITURE_TYPES.find((t) => t.type === furnitureType)
    if (!itemType) return

    const stageContainer = stageContainerRef.current
    if (!stageContainer) return

    const rect = stageContainer.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const targetRoom = findRoomAtPoint(rooms, x, y)

    addFurniture({
      type: furnitureType,
      x: x - toPixels(itemType.width) / 2,
      y: y - toPixels(itemType.height) / 2,
      width: toPixels(itemType.width),
      height: itemType.type === 'door' || itemType.type === 'window'
        ? itemType.type === 'door' ? 10 : 10
        : toPixels(itemType.height),
      rotation: 0,
      flip: 1,
      roomId: targetRoom?.id || null,
    })
  }

  const handleClear = () => {
    clearAll()
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header
        onExport={exportAsPng}
        onClear={handleClear}
        roomCount={rooms.length}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 bg-gray-200 p-4 overflow-auto">
          <div
            ref={stageContainerRef}
            className="relative bg-white rounded-lg shadow-lg overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <FloorCanvas
              scale={1}
              drawing={drawing}
              drawStart={drawStart}
              drawCurrent={drawCurrent}
              startDrawing={startDrawing}
              updateDrawing={updateDrawing}
              endDrawing={endDrawing}
              stageRef={stageRef}
              stageContainerRef={stageContainerRef}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
