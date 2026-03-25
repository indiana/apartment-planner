import { usePlannerStore } from '../../store/plannerStore'

export const SelectionControls = () => {
  const selectedId = usePlannerStore((state) => state.selectedId)
  const rooms = usePlannerStore((state) => state.rooms)
  const renameRoom = usePlannerStore((state) => state.renameRoom)
  const rotateSelected = usePlannerStore((state) => state.rotateSelected)
  const flipSelected = usePlannerStore((state) => state.flipSelected)
  const deleteSelected = usePlannerStore((state) => state.deleteSelected)
  const isSelectedRoom = usePlannerStore((state) => state.isSelectedRoom)
  const isSelectedDoor = usePlannerStore((state) => state.isSelectedDoor)

  if (!selectedId) return null

  const selectedRoom = rooms.find((r) => r.id === selectedId)

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <h2 className="text-sm font-medium text-gray-600 mb-3">Controls</h2>

      {isSelectedRoom() && selectedRoom && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1">Room Name</label>
          <input
            type="text"
            value={selectedRoom.name}
            onChange={(e) => renameRoom(selectedId, e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Room name"
          />
        </div>
      )}

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
        className="mt-2 w-full px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm"
      >
        Delete
      </button>
    </div>
  )
}
