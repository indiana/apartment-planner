import { useZoom } from '../../hooks'
import { usePlannerStore } from '../../store/plannerStore'

export const Header = ({ onExport, onClear, roomCount }) => {
  const { scale, zoomIn, zoomOut, zoomReset } = useZoom()
  const snapToWalls = usePlannerStore((state) => state.snapToWalls)
  const toggleSnapToWalls = usePlannerStore((state) => state.toggleSnapToWalls)

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-800">Apartment Planner</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={zoomOut}
            className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm font-medium"
          >
            −
          </button>
          <span className="px-2 text-sm text-gray-700 min-w-[50px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm font-medium"
          >
            +
          </button>
          <button
            onClick={zoomReset}
            className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm font-medium border-l border-gray-300"
          >
            Reset
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={snapToWalls}
            onChange={toggleSnapToWalls}
            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
          />
          Snap to walls
        </label>
        <button
          onClick={onExport}
          disabled={roomCount === 0}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          Export PNG
        </button>
        <button
          onClick={onClear}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
        >
          Clear
        </button>
      </div>
    </header>
  )
}
