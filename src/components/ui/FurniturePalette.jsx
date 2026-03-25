import { FURNITURE_TYPES, OPENING_TYPES, PIXELS_PER_METER } from '../../constants'

export const FurniturePalette = () => {
  const toPixels = (meters) => meters * PIXELS_PER_METER

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('text/plain', type)
  }

  return (
    <>
      <h2 className="text-sm font-medium text-gray-600 mb-3">Furniture</h2>
      <div className="space-y-2">
        {FURNITURE_TYPES.map((type) => (
          <div
            key={type.type}
            draggable
            onDragStart={(e) => handleDragStart(e, type.type)}
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
        {OPENING_TYPES.map((type) => (
          <div
            key={type.type}
            draggable
            onDragStart={(e) => handleDragStart(e, type.type)}
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
    </>
  )
}
