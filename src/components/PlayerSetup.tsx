import { useState } from 'react'
import { PLAYER_AVATARS, PLAYER_COLORS, type PlayerSetupEntry } from '../lib/gameLogic'

interface PlayerSetupProps {
  onStart: (entries: PlayerSetupEntry[]) => void
}

const MIN_PLAYERS = 2
const MAX_PLAYERS = 6

export default function PlayerSetup({ onStart }: PlayerSetupProps) {
  const [entries, setEntries] = useState<PlayerSetupEntry[]>([
    { name: '', avatar: PLAYER_AVATARS[0] },
    { name: '', avatar: PLAYER_AVATARS[1] },
  ])

  const updateName = (index: number, value: string) => {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, name: value } : e)))
  }

  const updateAvatar = (index: number, avatar: string) => {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, avatar } : e)))
  }

  const addPlayer = () => {
    if (entries.length >= MAX_PLAYERS) return
    setEntries((prev) => [...prev, { name: '', avatar: PLAYER_AVATARS[prev.length % PLAYER_AVATARS.length] }])
  }

  const removePlayer = (index: number) => {
    if (entries.length <= MIN_PLAYERS) return
    setEntries((prev) => prev.filter((_, i) => i !== index))
  }

  const trimmed = entries.map((e) => ({ ...e, name: e.name.trim() }))
  const canStart = trimmed.every((e) => e.name.length > 0) && trimmed.length >= MIN_PLAYERS

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      <div className="text-center">
        <div className="text-6xl mb-2">🧀</div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">
          Preguntados local
        </h1>
        <p className="text-slate-300 mt-2">
          Añade entre {MIN_PLAYERS} y {MAX_PLAYERS} jugadores para jugar por turnos en este mismo dispositivo.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {entries.map((entry, index) => (
          <div
            key={index}
            className="rounded-2xl p-3 flex flex-col gap-2"
            style={{
              backgroundColor: '#1e1b3a',
              border: `2px solid ${PLAYER_COLORS[index % PLAYER_COLORS.length]}55`,
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-11 h-11 rounded-full flex items-center justify-center text-2xl shrink-0"
                style={{ backgroundColor: PLAYER_COLORS[index % PLAYER_COLORS.length] }}
              >
                {entry.avatar}
              </span>
              <input
                value={entry.name}
                onChange={(e) => updateName(index, e.target.value)}
                placeholder={`Jugador ${index + 1}`}
                maxLength={20}
                className="flex-1 bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
              />
              {entries.length > MIN_PLAYERS && (
                <button
                  onClick={() => removePlayer(index)}
                  className="text-slate-500 hover:text-red-400 px-1"
                  aria-label="Quitar jugador"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="flex gap-1.5 flex-wrap pl-1">
              {PLAYER_AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => updateAvatar(index, avatar)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-base transition ${
                    entry.avatar === avatar ? 'bg-white/20 ring-2 ring-cyan-400' : 'hover:bg-white/10'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {entries.length < MAX_PLAYERS && (
        <button
          onClick={addPlayer}
          className="border-2 border-dashed border-slate-700 rounded-xl py-2 text-slate-400 hover:border-cyan-400 hover:text-cyan-300 transition"
        >
          + Añadir jugador
        </button>
      )}

      <button
        onClick={() => onStart(trimmed)}
        disabled={!canStart}
        className="bg-gradient-to-r from-pink-500 to-orange-400 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white font-bold text-lg py-3 rounded-xl shadow-[0_4px_0_0_#9f1239] disabled:shadow-none active:translate-y-1 active:shadow-none transition"
      >
        ¡Empezar partida!
      </button>
    </div>
  )
}
