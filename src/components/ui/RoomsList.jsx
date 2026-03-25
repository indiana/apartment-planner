import { usePlannerStore } from '../../store/plannerStore'
import { formatSurface, getTotalSurface } from '../../utils'

export const RoomsList = () => {
  const rooms = usePlannerStore((state) => state.rooms)
  const selectedId = usePlannerStore((state) => state.selectedId)
  const select = usePlannerStore((state) => state.select)

  if (rooms.length === 0) return null

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <h2 className="text-sm font-medium text-gray-600 mb-3">Rooms ({rooms.length})</h2>
      <div className="text-sm text-gray-700 space-y-1">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`text-xs cursor-pointer p-1 rounded ${
              selectedId === room.id ? 'bg-indigo-50 text-indigo-700' : ''
            }`}
            onClick={() => select(room.id)}
          >
            {room.name}: {formatSurface(room.widthMeters, room.heightMeters)}
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-gray-300 text-xs font-medium text-gray-800">
        Total: {getTotalSurface(rooms)}m²
      </div>
    </div>
  )
}
