# Agent Instructions for flat-planner

## Project Overview

This is an apartment floor planner webapp built with React + react-konva + Zustand. Users can draw rooms, place furniture (sofas, desks, beds, chairs), doors, and windows on a canvas with real-world measurements in meters.

## Build Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Lint (ESLint)
npm run lint

# Preview production build
npm run preview
```

### Running a Single Test

This project does not have a test suite configured. If tests are added in the future:

```bash
# Vitest
npm test                    # Run all tests
npm test -- file.test.js    # Run single test file
npm test -- --watch         # Watch mode

# Jest
npm test                    # Run all tests
npm test file.test.js       # Run single test file
npm test -- --watch         # Watch mode
```

## File Structure

```
src/
├── App.jsx                 # Main component - composes everything
├── main.jsx                # Entry point
├── index.css               # Tailwind imports and base styles
├── constants.js            # All configuration values
├── utils.js                # Pure utility functions
├── store/
│   └── plannerStore.js     # Zustand store with all state + actions
├── hooks/
│   ├── index.js            # Export all hooks
│   ├── useDrawing.js       # Room drawing state and handlers
│   ├── useZoom.js          # Zoom controls
│   └── useExport.js       # PNG export functionality
└── components/
    ├── canvas/
    │   ├── index.js
    │   ├── FloorCanvas.jsx     # Main canvas with Stage/Layers
    │   ├── Room.jsx            # Room rendering with labels
    │   ├── FurnitureRenderer.jsx # Renders different furniture types
    │   ├── Door.jsx            # Door with swing arc
    │   ├── Window.jsx          # Window with crosshairs
    │   └── DrawingPreview.jsx  # Dashed preview while drawing
    └── ui/
        ├── index.js
        ├── Header.jsx          # Title, zoom controls, export/clear
        ├── Sidebar.jsx         # Composes sidebar sections
        ├── FurniturePalette.jsx # Draggable furniture items
        ├── SelectionControls.jsx # Rotate, flip, delete buttons
        └── RoomsList.jsx       # Room list with surfaces
```

## Code Style Guidelines

### General Conventions

- **Indentation**: 2 spaces for JSX and JS files
- **Semicolons**: Not required (ESLint handles this)
- **Quotes**: Single quotes for strings in JS, double quotes for JSX attributes
- **Line length**: Max 100 characters recommended
- **Trailing commas**: Optional in multiline structures

### Import Order

1. React hooks (`useState`, `useRef`, `useEffect`, `useCallback`)
2. react-konva components (`Stage`, `Layer`, `Rect`, `Group`, `Transformer`, etc.)
3. Third-party libraries (zustand)
4. Local modules (store, hooks, components, constants, utils)

**Example:**
```jsx
import { useState, useRef, useEffect } from 'react'
import { Stage, Layer, Rect, Group } from 'react-konva'
import { usePlannerStore } from './store/plannerStore'
import { Room } from './components/canvas'
import { CANVAS_WIDTH, COLORS } from './constants'
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `App`, `Room`, `FloorCanvas` |
| Hooks | camelCase with `use` prefix | `useDrawing`, `useZoom` |
| Store | camelCase with `Store` suffix | `usePlannerStore` |
| Functions | camelCase | `handleDragStart`, `select` |
| Constants | UPPER_SNAKE_CASE | `STORAGE_KEY`, `PIXELS_PER_METER` |
| Event handlers | `handle` prefix | `handleMouseDown`, `onClick` |
| State setters | In Zustand actions | `addRoom`, `updateRoom`, `deleteRoom` |
| Refs | `Ref` suffix | `stageRef`, `transformerRef` |
| IDs | `kebab-case` with prefix | `room-${Date.now()}`, `furniture-1` |

### Zustand Store Patterns

**Store Definition:**
```javascript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const usePlannerStore = create(
  persist(
    (set, get) => ({
      // State
      rooms: [],
      furniture: [],
      selectedId: null,

      // Actions
      addRoom: (roomData) => {
        set((state) => ({
          rooms: [...state.rooms, { id: generateId('room'), ...roomData }]
        }))
      },

      updateRoom: (id, updates) => {
        set((state) => ({
          rooms: state.rooms.map((room) =>
            room.id === id ? { ...room, ...updates } : room
          )
        }))
      },
      // ... more actions
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        rooms: state.rooms,
        furniture: state.furniture,
      }),
    }
  )
)
```

**Using the Store:**
```jsx
// Select specific state slices to minimize re-renders
const rooms = usePlannerStore((state) => state.rooms)
const addRoom = usePlannerStore((state) => state.addRoom)
const select = usePlannerStore((state) => state.select)
```

### React Patterns

#### useEffect Dependencies
```jsx
// Always include all dependencies
useEffect(() => {
  transformerRef.current.nodes([selectedNode])
  transformerRef.current.getLayer().batchDraw()
}, [selectedId])
```

#### Konva-Specific Patterns

**IDs on Transformable Elements:**
```jsx
// ID MUST be on the Group/Rect, not on child elements
<Group
  id={room.id}        // Correct - ID on Group
  draggable
  onDragEnd={handleDragEnd}
>
  <Rect width={100} height={100} />  {/* No ID here */}
</Group>
```

**Checking for Anchor Clicks:**
```jsx
import { isCanvasClick, isAnchorClick, isTransformerClick } from '../../utils'

const handleMouseDown = (e) => {
  if (isCanvasClick(e)) {
    // Clicked on empty canvas
  } else if (isAnchorClick(e) || isTransformerClick(e)) {
    // Don't deselect
  }
}
```

### Error Handling

#### localStorage (via Zustand persist)
```javascript
// Errors are handled automatically by Zustand persist middleware
// No manual try/catch needed
```

#### Null Checks
```jsx
// Check before accessing refs
const stage = stageRef.current
if (!stage) return

// Check before accessing array elements
const room = rooms.find(r => r.id === id)
if (!room) return
```

### JSX Style

```jsx
// Props on same line if short
<button onClick={handleClick} className="px-4 py-2">

// Props on multiple lines if many
<Stage
  ref={stageRef}
  width={1200}
  height={800}
  scale={{ x: scale, y: scale }}
  onMouseDown={handleMouseDown}
>
```

### Tailwind CSS Usage

- Use Tailwind for all styling (configured via `@tailwindcss/vite`)
- Utility classes: `flex`, `items-center`, `gap-4`, `bg-gray-100`
- Responsive: `md:flex-row`, `lg:w-1/2`
- Interactive: `hover:bg-gray-200`, `active:cursor-grabbing`

## Common Tasks

### Adding New Furniture Type

1. Add to `FURNITURE_TYPES` array in `src/constants.js`
2. Add render logic in `src/components/canvas/FurnitureRenderer.jsx`
3. Add to `FurniturePalette` in `src/components/ui/FurniturePalette.jsx`

### Adding New Canvas Element

1. Create new component in `src/components/canvas/`
2. Export from `src/components/canvas/index.js`
3. Import and use in `FloorCanvas.jsx`

### Adding New UI Section

1. Create new component in `src/components/ui/`
2. Export from `src/components/ui/index.js`
3. Import and compose in `Sidebar.jsx`

### Adding Store Actions

1. Add action to `src/store/plannerStore.js`
2. Actions receive `set` and `get` parameters
3. Use `set((state) => ({ ... }))` for state updates

### Debugging Canvas Issues

- Check browser console for React/Konva errors
- Use `console.log` on event handlers to trace interactions
- Verify IDs are unique and correctly placed
- Check that `draggable` prop is set on transformable elements
- Use React DevTools to inspect component tree
- Use Zustand DevTools to inspect state changes
