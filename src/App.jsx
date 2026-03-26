import { useRef } from 'react'
import { usePlannerStore } from './store'
import { useDrawing, useExport, useKeyboard, useDragDrop } from './hooks'
import { FloorCanvas } from './components/canvas'
import { Header, Sidebar, SelectionPanel } from './components/ui'

function App() {
  const stageRef = useRef(null)
  const stageContainerRef = useRef(null)
  const rooms = usePlannerStore((s) => s.rooms)
  const clearAll = usePlannerStore((s) => s.clearAll)

  useKeyboard()

  const {
    drawing,
    drawStart,
    drawCurrent,
    startDrawing,
    updateDrawing,
    endDrawing,
  } = useDrawing()

  const { exportAsPng } = useExport(stageRef)
  const { handleDragOver, handleDrop } = useDragDrop(stageContainerRef)

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

        <SelectionPanel />
      </div>
    </div>
  )
}

export default App
