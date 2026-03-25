# Apartment Floor Planner

An interactive web application for designing apartment layouts. Draw rooms, place furniture, doors, and windows on a canvas with real-world measurements.

## Features

- **Room Drawing**: Click and drag to create rooms with precise measurements
- **Furniture Placement**: Drag and drop furniture items (sofas, desks, beds, chairs)
- **Doors & Windows**: Add openings with swing arc visualization
- **Transform Controls**: Resize, rotate, and reposition items with Konva transformer
- **Snap to Walls**: Optional snapping to align furniture with walls and other objects
- **Zoom Controls**: Zoom in/out and reset view
- **PNG Export**: Export your floor plan as an image
- **Persistent Storage**: All data saved to localStorage
- **Name Labels**: Toggle visibility of furniture and room names

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

### Drawing Rooms

1. Click and drag on the canvas to draw a room
2. The room dimensions are displayed in meters
3. Click on a room to select it, then use the right panel to rename it

### Placing Furniture

1. Drag furniture from the left sidebar onto a room
2. Furniture is automatically linked to the room
3. When the room moves, furniture moves with it

### Selection Panel

When an item is selected, the right panel shows:
- **Name**: Edit the item's name
- **Show name**: Toggle name visibility on canvas
- **Controls**: Rotate, flip, and delete buttons

### Snap to Walls

Enable the "Snap to walls" checkbox in the toolbar to align furniture with:
- Room walls
- Other furniture edges
- Canvas boundaries

### Export

Click "Export PNG" to download your floor plan as an image.

## Tech Stack

- **React** - UI framework
- **react-konva** - Canvas rendering
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Project Structure

```
src/
├── App.jsx                 # Main application component
├── main.jsx                # Entry point
├── constants.js            # Configuration (colors, dimensions, limits)
├── utils.js                # Utility functions
├── store/
│   └── plannerStore.js     # Zustand store with all state
├── hooks/
│   ├── index.js            # Hook exports
│   ├── useDrawing.js       # Room drawing logic
│   ├── useZoom.js         # Zoom controls
│   └── useExport.js       # PNG export
└── components/
    ├── canvas/             # Canvas components (rooms, furniture, doors, windows)
    └── ui/                 # UI components (header, sidebar, panels)
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Measurements

- Scale: 1 meter = 100 pixels
- Grid: 20px squares
- Minimum room size: 50px (0.5m)
- Minimum furniture size: 20px (0.2m)
