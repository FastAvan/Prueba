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

export const PLAYER_AVATARS = ['😀', '😎', '🤓', '🥳', '🤠', '👽', '🐱', '🦊', '🐼', '🦁']

export interface PlayerSetupEntry {
  name: string
  avatar: string
}

export function createPlayers(entries: PlayerSetupEntry[]): Player[] {
  return entries.map((entry, i) => ({
    id: `p${i}-${entry.name}`,
    name: entry.name,
    avatar: entry.avatar,
    color: PLAYER_COLORS[i % PLAYER_COLORS.length],
    position: 0,
    wedges: new Set(),
  }))
}

export function createInitialState(entries: PlayerSetupEntry[]): GameState {
  return {
    players: createPlayers(entries),
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
