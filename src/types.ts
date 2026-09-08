export type CategoryId =
  | 'geografia'
  | 'entretenimiento'
  | 'historia'
  | 'arte'
  | 'ciencia'
  | 'deportes'

export interface Category {
  id: CategoryId
  label: string
  color: string
  colorDark: string
}

export interface Question {
  category: CategoryId
  question: string
  options: [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
}

export interface Player {
  id: string
  name: string
  avatar: string
  color: string
  position: number
  wedges: Set<CategoryId>
}

export type Phase = 'setup' | 'rolling' | 'moving' | 'question' | 'result' | 'finished'

export interface GameState {
  players: Player[]
  currentPlayerIndex: number
  phase: Phase
  lastRoll: number | null
  activeQuestion: Question | null
  lastAnswerCorrect: boolean | null
  wonWedgeThisTurn: CategoryId | null
  winnerId: string | null
}
