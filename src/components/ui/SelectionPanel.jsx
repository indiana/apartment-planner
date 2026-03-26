import { usePlannerStore } from '../../store'
import { PropertyInputs } from './panels/PropertyInputs'
import { TransformControls } from './panels/TransformControls'

export const SelectionPanel = () => {
  const selectedId = usePlannerStore((s) => s.selectedId)
  const rooms = usePlannerStore((s) => s.rooms)
  const furniture = usePlannerStore((s) => s.furniture)

  if (!selectedId) return null

  const selectedRoom = rooms.find((r) => r.id === selectedId)
  const selectedFurniture = furniture.find((f) => f.id === selectedId)
  const isRoom = selectedId.startsWith('room-')
  const item = isRoom ? selectedRoom : selectedFurniture

  return (
    <aside className="w-56 bg-white border-l border-gray-200 p-4">
      <h2 className="text-sm font-medium text-gray-600 mb-3">Properties</h2>

      <PropertyInputs
        item={item}
        isRoom={isRoom}
        selectedFurniture={selectedFurniture}
      />

      <TransformControls />
    </aside>
  )
}
