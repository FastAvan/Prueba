import { BOARD_SIZE } from '../data/board'
import type { GameState, Player } from '../types'

export const PLAYER_COLORS = [
  '#f43f5e', // rosa
  '#3b82f6', // azul
  '#eab308', // amarillo
  '#22c55e', // verde
  '#a855f7', // violeta
  '#f97316', // naranja
]

export function createPlayers(names: string[]): Player[] {
  return names.map((name, i) => ({
    id: `p${i}-${name}`,
    name,
    color: PLAYER_COLORS[i % PLAYER_COLORS.length],
    position: 0,
    wedges: new Set(),
  }))
}

export function createInitialState(names: string[]): GameState {
  return {
    players: createPlayers(names),
    currentPlayerIndex: 0,
    phase: 'rolling',
    lastRoll: null,
    activeQuestion: null,
    lastAnswerCorrect: null,
    wonWedgeThisTurn: null,
    winnerId: null,
  }
}

export function rollDice(): number {
  return 1 + Math.floor(Math.random() * 6)
}

export function nextPosition(current: number, roll: number): number {
  return (current + roll) % BOARD_SIZE
}
