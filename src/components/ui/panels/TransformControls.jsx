import { usePlannerStore } from '../../../store'

export const TransformControls = () => {
  const rotateSelected = usePlannerStore((s) => s.rotateSelected)
  const flipSelected = usePlannerStore((s) => s.flipSelected)
  const deleteSelected = usePlannerStore((s) => s.deleteSelected)
  const isSelectedDoor = usePlannerStore((s) => s.isSelectedDoor)

  return (
    <>
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
    </>
  )
}
