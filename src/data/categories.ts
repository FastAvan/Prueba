import type { Category, CategoryId } from '../types'

export const CATEGORIES: (Category & { icon: string })[] = [
  { id: 'geografia', label: 'Geografía', color: '#22c55e', colorDark: '#15803d', icon: '🌎' },
  { id: 'entretenimiento', label: 'Entretenimiento', color: '#ec4899', colorDark: '#be185d', icon: '🎬' },
  { id: 'historia', label: 'Historia', color: '#f59e0b', colorDark: '#b45309', icon: '📜' },
  { id: 'arte', label: 'Arte y Literatura', color: '#3b82f6', colorDark: '#1d4ed8', icon: '🎨' },
  { id: 'ciencia', label: 'Ciencia y Naturaleza', color: '#06b6d4', colorDark: '#0e7490', icon: '🔬' },
  { id: 'deportes', label: 'Deportes y Ocio', color: '#ef4444', colorDark: '#b91c1c', icon: '⚽' },
]

export const CATEGORY_BY_ID: Record<CategoryId, (typeof CATEGORIES)[number]> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, (typeof CATEGORIES)[number]>
