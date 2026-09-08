import { CATEGORIES } from './categories'
import type { CategoryId } from '../types'

export const BOARD_SIZE = 24
export const HUB_STEP = BOARD_SIZE / CATEGORIES.length // 4

export interface BoardCell {
  index: number
  category: CategoryId
  isHub: boolean
}

export const BOARD_CELLS: BoardCell[] = Array.from({ length: BOARD_SIZE }, (_, index) => {
  const isHub = index % HUB_STEP === 0
  const category = isHub
    ? CATEGORIES[index / HUB_STEP].id
    : CATEGORIES[index % CATEGORIES.length].id
  return { index, category, isHub }
})
