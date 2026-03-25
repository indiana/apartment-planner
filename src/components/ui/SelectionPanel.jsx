import { usePlannerStore } from '../../store/plannerStore'

export const SelectionPanel = () => {
  const selectedId = usePlannerStore((state) => state.selectedId)
  const rooms = usePlannerStore((state) => state.rooms)
  const furniture = usePlannerStore((state) => state.furniture)
  const renameRoom = usePlannerStore((state) => state.renameRoom)
  const renameFurniture = usePlannerStore((state) => state.renameFurniture)
  const setShowName = usePlannerStore((state) => state.setShowName)
  const rotateSelected = usePlannerStore((state) => state.rotateSelected)
  const flipSelected = usePlannerStore((state) => state.flipSelected)
  const deleteSelected = usePlannerStore((state) => state.deleteSelected)
  const isSelectedDoor = usePlannerStore((state) => state.isSelectedDoor)

  if (!selectedId) return null

  const selectedRoom = rooms.find((r) => r.id === selectedId)
  const selectedFurniture = furniture.find((f) => f.id === selectedId)
  const isRoom = selectedId.startsWith('room-')

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

  const item = isRoom ? selectedRoom : selectedFurniture

  return (
    <aside className="w-56 bg-white border-l border-gray-200 p-4">
      <h2 className="text-sm font-medium text-gray-600 mb-3">Properties</h2>

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

      <div className="flex gap-2">
        <button
          onClick={() => rotateSelected(-90)}
          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
        >
          ↺ 90°
        </button>
        <button
          onClick={() => rotateSelected(90)}
          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
        >
          ↻ 90°
        </button>
        {isSelectedDoor() && (
          <button
            onClick={flipSelected}
            className="flex-1 px-3 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm"
            title="Flip door"
          >
            ⇄
          </button>
        )}
      </div>

      <button
        onClick={deleteSelected}
        className="mt-4 w-full px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm"
      >
        Delete
      </button>
    </aside>
  )
}
