import { useMemo, useRef, useState } from 'react'
import Board from './components/Board'
import Dice from './components/Dice'
import PlayerSetup from './components/PlayerSetup'
import QuestionModal from './components/QuestionModal'
import Scoreboard from './components/Scoreboard'
import { BOARD_CELLS } from './data/board'
import { CATEGORIES } from './data/categories'
import { createInitialState, nextPosition, rollDice, type PlayerSetupEntry } from './lib/gameLogic'
import { QuestionBank } from './lib/questionBank'
import type { GameState, Question } from './types'

const TOTAL_WEDGES = CATEGORIES.length

export default function App() {
  const [state, setState] = useState<GameState | null>(null)
  const [rolling, setRolling] = useState(false)
  const questionBank = useRef(new QuestionBank())

  const currentPlayer = state?.players[state.currentPlayerIndex] ?? null
  const currentCell = currentPlayer ? BOARD_CELLS[currentPlayer.position] : null

  const winner = useMemo(
    () => (state?.winnerId ? state.players.find((p) => p.id === state.winnerId) ?? null : null),
    [state],
  )

  const startGame = (entries: PlayerSetupEntry[]) => {
    setState(createInitialState(entries))
  }

  const handleRoll = () => {
    if (!state || rolling) return
    setRolling(true)
    window.setTimeout(() => {
      setState((prev) => {
        if (!prev) return prev
        const player = prev.players[prev.currentPlayerIndex]
        const roll = rollDice()
        const position = nextPosition(player.position, roll)
        const cell = BOARD_CELLS[position]
        const question: Question = questionBank.current.next(cell.category)
        const players = prev.players.map((p, i) => (i === prev.currentPlayerIndex ? { ...p, position } : p))
        return {
          ...prev,
          players,
          lastRoll: roll,
          activeQuestion: question,
          phase: 'question',
          lastAnswerCorrect: null,
          wonWedgeThisTurn: null,
        }
      })
      setRolling(false)
    }, 550)
  }

  const handleResolved = (correct: boolean) => {
    setState((prev) => {
      if (!prev) return prev
      const player = prev.players[prev.currentPlayerIndex]
      const cell = BOARD_CELLS[player.position]
      let players = prev.players
      let wonWedge: GameState['wonWedgeThisTurn'] = null
      let winnerId = prev.winnerId

      if (correct && cell.isHub && !player.wedges.has(cell.category)) {
        wonWedge = cell.category
        players = prev.players.map((p, i) => {
          if (i !== prev.currentPlayerIndex) return p
          const wedges = new Set(p.wedges)
          wedges.add(cell.category)
          if (wedges.size === TOTAL_WEDGES) winnerId = p.id
          return { ...p, wedges }
        })
      }

      return { ...prev, players, lastAnswerCorrect: correct, wonWedgeThisTurn: wonWedge, winnerId }
    })
  }

  const handleContinue = () => {
    setState((prev) => {
      if (!prev) return prev
      if (prev.winnerId) {
        return { ...prev, phase: 'finished', activeQuestion: null }
      }
      const advanceTurn = !prev.lastAnswerCorrect
      const currentPlayerIndex = advanceTurn
        ? (prev.currentPlayerIndex + 1) % prev.players.length
        : prev.currentPlayerIndex
      return {
        ...prev,
        currentPlayerIndex,
        phase: 'rolling',
        activeQuestion: null,
        lastAnswerCorrect: null,
        wonWedgeThisTurn: null,
      }
    })
  }

  const resetGame = () => setState(null)

  if (!state || !currentPlayer) {
    return (
      <main className="min-h-full flex items-center justify-center px-4 py-10">
        <PlayerSetup onStart={startGame} />
      </main>
    )
  }

  return (
    <main className="min-h-full max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold bg-gradient-to-r from-pink-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">
          Preguntados local
        </h1>
        <button onClick={resetGame} className="text-sm text-slate-400 hover:text-slate-200 underline">
          Nueva partida
        </button>
      </header>

      {state.phase === 'finished' && winner ? (
        <section className="flex flex-col items-center gap-6 py-10 text-center rounded-3xl" style={{ backgroundColor: '#171331' }}>
          <span className="text-6xl">🏆</span>
          <h2 className="text-3xl font-extrabold text-slate-100">
            {winner.avatar} ¡{winner.name} ganó la partida!
          </h2>
          <p className="text-slate-400">Consiguió los {TOTAL_WEDGES} quesitos de todas las categorías.</p>
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold px-6 py-3 rounded-xl shadow-[0_4px_0_0_#9f1239] active:translate-y-1 active:shadow-none transition"
          >
            Jugar de nuevo
          </button>
        </section>
      ) : (
        <>
          <Board players={state.players} currentPlayerId={currentPlayer.id} />

          <section
            className="flex items-center justify-between rounded-2xl px-4 py-3"
            style={{ backgroundColor: '#171331', border: '2px solid #332b63' }}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{ backgroundColor: currentPlayer.color }}
              >
                {currentPlayer.avatar}
              </span>
              <div>
                <p className="text-slate-100 font-semibold">Turno de {currentPlayer.name}</p>
                <p className="text-slate-400 text-sm">
                  {currentCell?.isHub ? 'Casilla de quesito 🧀' : 'Casilla normal'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Dice value={state.lastRoll} rolling={rolling} />
              {state.phase === 'rolling' && (
                <button
                  onClick={handleRoll}
                  disabled={rolling}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold px-5 py-3 rounded-xl shadow-[0_4px_0_0_#1e40af] disabled:shadow-none active:translate-y-1 active:shadow-none transition"
                >
                  Tirar dado
                </button>
              )}
            </div>
          </section>

          <Scoreboard players={state.players} currentPlayerId={currentPlayer.id} />
        </>
      )}

      {state.phase === 'question' && state.activeQuestion && (
        <QuestionModal
          question={state.activeQuestion}
          player={currentPlayer}
          isHub={Boolean(currentCell?.isHub)}
          onResolved={handleResolved}
          onContinue={handleContinue}
        />
      )}
    </main>
  )
}
