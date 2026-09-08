import { useState } from 'react'
import { PLAYER_COLORS } from '../lib/gameLogic'

interface PlayerSetupProps {
  onStart: (names: string[]) => void
}

const MIN_PLAYERS = 2
const MAX_PLAYERS = 6

export default function PlayerSetup({ onStart }: PlayerSetupProps) {
  const [names, setNames] = useState<string[]>(['', ''])

  const updateName = (index: number, value: string) => {
    setNames((prev) => prev.map((n, i) => (i === index ? value : n)))
  }

  const addPlayer = () => {
    if (names.length >= MAX_PLAYERS) return
    setNames((prev) => [...prev, ''])
  }

  const removePlayer = (index: number) => {
    if (names.length <= MIN_PLAYERS) return
    setNames((prev) => prev.filter((_, i) => i !== index))
  }

  const trimmed = names.map((n) => n.trim())
  const canStart = trimmed.every((n) => n.length > 0) && trimmed.length >= MIN_PLAYERS

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-100">Preguntados local</h1>
        <p className="text-slate-400 mt-2">
          Sumá entre {MIN_PLAYERS} y {MAX_PLAYERS} jugadores para jugar por turnos en este mismo dispositivo.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {names.map((name, index) => (
          <div key={index} className="flex items-center gap-3">
            <span
              className="w-4 h-4 rounded-full shrink-0"
              style={{ backgroundColor: PLAYER_COLORS[index % PLAYER_COLORS.length] }}
            />
            <input
              value={name}
              onChange={(e) => updateName(index, e.target.value)}
              placeholder={`Jugador ${index + 1}`}
              maxLength={20}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-sky-500"
            />
            {names.length > MIN_PLAYERS && (
              <button
                onClick={() => removePlayer(index)}
                className="text-slate-500 hover:text-red-400 px-2"
                aria-label="Quitar jugador"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {names.length < MAX_PLAYERS && (
        <button
          onClick={addPlayer}
          className="border border-dashed border-slate-700 rounded-lg py-2 text-slate-400 hover:border-sky-500 hover:text-sky-400 transition"
        >
          + Añadir jugador
        </button>
      )}

      <button
        onClick={() => onStart(trimmed)}
        disabled={!canStart}
        className="bg-sky-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3 rounded-lg transition hover:bg-sky-500"
      >
        Empezar partida
      </button>
    </div>
  )
}
