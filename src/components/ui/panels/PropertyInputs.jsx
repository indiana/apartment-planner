import { usePlannerStore } from '../../../store'
import { toMeters } from '../../../utils'
import { PIXELS_PER_METER } from '../../../constants'

export const PropertyInputs = ({ item, isRoom, selectedFurniture }) => {
  const renameRoom = usePlannerStore((s) => s.renameRoom)
  const renameFurniture = usePlannerStore((s) => s.renameFurniture)
  const setShowName = usePlannerStore((s) => s.setShowName)
  const updateFurniture = usePlannerStore((s) => s.updateFurniture)
  const selectedId = usePlannerStore((s) => s.selectedId)

  const handleNameChange = (e) => {
    const newName = e.target.value
    if (isRoom) {
      renameRoom(selectedId, newName)
    } else {
      renameFurniture(selectedId, newName)
    }
  }

  const handleShowNameChange = (e) => {
    setShowName(selectedId, e.target.checked)
  }

  const handleWidthChange = (e) => {
    const widthMeters = parseFloat(e.target.value)
    if (isNaN(widthMeters) || widthMeters <= 0) return
    const widthPixels = Math.round(widthMeters * PIXELS_PER_METER)
    updateFurniture(selectedId, { width: widthPixels })
  }

  const handleHeightChange = (e) => {
    const heightMeters = parseFloat(e.target.value)
    if (isNaN(heightMeters) || heightMeters <= 0) return
    const heightPixels = Math.round(heightMeters * PIXELS_PER_METER)
    updateFurniture(selectedId, { height: heightPixels })
  }

  const isOpening = selectedFurniture && ['door', 'window', 'passage'].includes(selectedFurniture.type)
  const showHeight = selectedFurniture && !isOpening

  return (
    <>
      <div className="mb-3">
        <label className="block text-xs text-gray-500 mb-1">Name</label>
        <input
          type="text"
          value={item?.name || ''}
          onChange={handleNameChange}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Name"
        />
      </div>

      {!isRoom && selectedFurniture && (
        <>
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-1">Width (m)</label>
            <input
              type="number"
              step="0.1"
              min="0.2"
              max="10"
              value={toMeters(selectedFurniture.width).toFixed(1)}
              onChange={handleWidthChange}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {showHeight && (
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">Height (m)</label>
              <input
                type="number"
                step="0.1"
                min="0.2"
                max="10"
                value={toMeters(selectedFurniture.height).toFixed(1)}
                onChange={handleHeightChange}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
        </>
      )}

      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={item?.showName ?? true}
            onChange={handleShowNameChange}
            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
          />
          Show name
        </label>
      </div>
    </>
  )
}
