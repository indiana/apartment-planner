# Agent Instructions for flat-planner

## Project Overview

This is an apartment floor planner webapp built with React + react-konva. Users can draw rooms, place furniture (sofas, desks, beds, chairs), doors, and windows on a canvas with real-world measurements in meters.

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

## Code Style Guidelines

### General Conventions

- **Indentation**: 2 spaces for JSX and JS files
- **Semicolons**: Not required (ESLint handles this)
- **Quotes**: Single quotes for strings in JS, double quotes for JSX attributes
- **Line length**: Max 100 characters recommended
- **Trailing commas**: Optional in multiline structures

### File Structure

```
src/
├── App.jsx          # Main component (all logic in single file for simplicity)
├── main.jsx         # Entry point
└── index.css        # Tailwind imports and base styles
```

### Import Order

1. React hooks (`useState`, `useRef`, `useEffect`, `useCallback`)
2. react-konva components (`Stage`, `Layer`, `Rect`, `Group`, `Transformer`, etc.)
3. Third-party libraries
4. Local utilities/constants

**Example:**
```jsx
import { useState, useRef, useEffect, useCallback } from 'react'
import { Stage, Layer, Rect, Line, Group, Transformer, Text, Arc, Shape } from 'react-konva'

const STORAGE_KEY = 'apartment-planner-data'
const GRID_SIZE = 20
const PIXELS_PER_METER = 50
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `App`, `FloorPlanner` |
| Functions | camelCase | `handleDragStart`, `handleSelect` |
| Constants | UPPER_SNAKE_CASE | `STORAGE_KEY`, `PIXELS_PER_METER` |
| Event handlers | `handle` prefix | `handleMouseDown`, `handleClick` |
| State setters | `set` prefix | `setRooms`, `setFurniture` |
| Refs | `Ref` suffix | `stageRef`, `transformerRef` |
| IDs | `kebab-case` with prefix | `room-${Date.now()}`, `furniture-1` |

### React Patterns

#### State Management
```jsx
// Use functional updates for derived state
const [items, setItems] = useState([])

const addItem = (newItem) => {
  setItems(prev => [...prev, newItem])
}

// Batch related state in objects when appropriate
const [drawState, setDrawState] = useState({
  isDrawing: false,
  start: null,
  current: null,
})
```

#### useEffect Dependencies
```jsx
// Always include all dependencies - lint rule enforces this
useEffect(() => {
  localStorage.setItem(KEY, JSON.stringify(data))
}, [data])  // Include all referenced variables
```

#### useCallback for Event Handlers
```jsx
// Wrap event handlers in useCallback when passed to child components
const handleDelete = useCallback(() => {
  if (selectedId) {
    setItems(items.filter(item => item.id !== selectedId))
  }
}, [selectedId, items])
```

#### Konva-Specific Patterns

**IDs on Transformable Elements:**
```jsx
// ID MUST be on the Group/Rect, not on child elements
<Group
  id={item.id}        // Correct - ID on Group
  draggable
  onDragEnd={...}
>
  <Rect width={100} height={100} />  {/* No ID here */}
</Group>
```

**Checking for Anchor Clicks:**
```jsx
const handleMouseDown = (e) => {
  const clickedOnAnchor = e.target.getClassName() === 'Anchor'
  const clickedOnTransformer = e.target.getParent()?.getClassName() === 'Transformer'
  
  if (clickedOnEmpty && !clickedOnAnchor && !clickedOnTransformer) {
    // Start drawing new room
  }
}
```

**Transform End Handler:**
```jsx
const handleTransformEnd = (e, id) => {
  const node = e.target
  // Reset scale after transform
  node.scaleX(1)
  node.scaleY(1)
  
  // Update state with new dimensions
  setItems(items.map(item => {
    if (item.id === id) {
      return { ...item, width: node.width(), height: node.height() }
    }
    return item
  }))
}
```

### Error Handling

#### localStorage
```jsx
useEffect(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      setRooms(data.rooms || [])
      setFurniture(data.furniture || [])
    }
  } catch (error) {
    console.error('Failed to load saved data:', error)
  }
}, [])
```

#### Null Checks
```jsx
// Check before accessing refs
const stage = stageRef.current
if (!stage) return

// Check before accessing array elements
const item = items.find(t => t.type === furnitureType)
if (!item) return
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

### Type Safety

This project uses JSDoc for documentation. When adding functions, include parameter and return types:

```jsx
/**
 * @param {number} meters - Distance in meters
 * @returns {number} - Distance in pixels
 */
const toPixels = (meters) => meters * PIXELS_PER_METER
```

### LocalStorage Persistence Pattern

```jsx
// Load on mount
useEffect(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const data = JSON.parse(saved)
    // Validate structure before setting state
    if (Array.isArray(data.rooms)) {
      setRooms(data.rooms)
    }
  }
}, [])

// Save on change
useEffect(() => {
  if (rooms.length > 0 || furniture.length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ rooms, furniture }))
  }
}, [rooms, furniture])
```

## Konva Canvas Notes

### Scale and Zoom
- Zoom implemented via Stage `scale` prop, not canvas resizing
- Mouse positions need adjustment: `stage.getPointerPosition()` already accounts for scale

### Grid Drawing
```jsx
const drawGrid = () => {
  const lines = []
  const canvasWidth = 1200
  const canvasHeight = 800

  for (let i = 0; i <= canvasWidth / GRID_SIZE; i++) {
    lines.push(
      <Line
        key={`v-${i}`}
        points={[i * GRID_SIZE, 0, i * GRID_SIZE, canvasHeight]}
        stroke="#e5e7eb"
        strokeWidth={1}
        name="grid"
      />
    )
  }
  return lines
}
```

### Room Structure
- Rooms are `Group` components with `x/y` for positioning (not inner Rect)
- Text labels inside rooms use positions relative to Group origin
- Room dimensions stored in both pixels and meters (`widthMeters`, `heightMeters`)

## Common Tasks

### Adding New Furniture Type
1. Add to `FURNITURE_TYPES` array in App.jsx
2. Add render logic in `renderFurniture` function
3. Update sidebar palette

### Adding New Tool/Action
1. Add state variable if needed
2. Create handler function
3. Add UI button/control
4. Wire up in JSX

### Debugging Canvas Issues
- Check browser console for React/Konva errors
- Use `console.log` on event handlers to trace interactions
- Verify IDs are unique and correctly placed
- Check that `draggable` prop is set on transformable elements
