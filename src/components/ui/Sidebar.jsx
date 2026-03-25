import { FurniturePalette } from './FurniturePalette'
import { SelectionControls } from './SelectionControls'
import { RoomsList } from './RoomsList'

export const Sidebar = () => {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 p-4">
      <FurniturePalette />
      <SelectionControls />
      <RoomsList />
    </aside>
  )
}
