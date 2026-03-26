export const STORAGE_KEY = 'apartment-planner-data'

export const GRID_SIZE = 20
export const CANVAS_WIDTH = 1200
export const CANVAS_HEIGHT = 800
export const PIXELS_PER_METER = 100

export const ZOOM_MIN = 0.3
export const ZOOM_MAX = 3
export const ZOOM_STEP = 0.1
export const ZOOM_DEFAULT = 1

export const FURNITURE_TYPES = [
  { type: 'sofa', name: 'Sofa', width: 2, height: 0.9, color: '#6366f1' },
  { type: 'desk', name: 'Desk', width: 1.2, height: 0.6, color: '#22c55e' },
  { type: 'bed', name: 'Bed', width: 2, height: 1.6, color: '#f59e0b' },
  { type: 'chair', name: 'Chair', width: 0.5, height: 0.5, color: '#ef4444' },
]

export const OPENING_TYPES = [
  { type: 'door', name: 'Door', width: 0.9, height: 0.1, color: '#8b5cf6' },
  { type: 'window', name: 'Window', width: 1.2, height: 0.1, color: '#06b6d4' },
]

export const WALL_OPENING_TYPES = [
  { type: 'passage', name: 'Passage', width: 1.0, height: 0.05, color: '#374151' },
]

export const COLORS = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  grid: '#e5e7eb',
  room: {
    fill: '#f3f4f6',
    stroke: '#374151',
    strokeSelected: '#6366f1',
    text: '#374151',
    dimension: '#6b7280',
  },
  furniture: {
    sofa: '#6366f1',
    desk: '#22c55e',
    bed: '#f59e0b',
    chair: '#ef4444',
  },
  door: '#8b5cf6',
  window: '#06b6d4',
  windowFill: '#e0f2fe',
  drawingPreview: 'rgba(99, 102, 241, 0.1)',
}

export const LIMITS = {
  minRoomSize: 50,
  minFurnitureSize: 20,
  minDrawingSize: 50,
}

export const TRANSFORMER_CONFIG = {
  anchorSize: 8,
  anchorCornerRadius: 2,
  borderStroke: COLORS.primary,
  anchorStroke: COLORS.primary,
  anchorFill: 'white',
  keepRatio: false,
  enabledAnchors: [
    'top-left', 'top-right', 'bottom-left', 'bottom-right',
    'middle-left', 'middle-right', 'top-center', 'bottom-center'
  ],
}
