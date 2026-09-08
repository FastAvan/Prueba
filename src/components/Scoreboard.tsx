import { CATEGORIES } from '../data/categories'
import type { Player } from '../types'

interface ScoreboardProps {
  players: Player[]
  currentPlayerId: string
}

export default function Scoreboard({ players, currentPlayerId }: ScoreboardProps) {
  return (
    <div className="flex flex-col gap-2">
      {players.map((player) => {
        const isCurrent = player.id === currentPlayerId
        return (
          <div
            key={player.id}
            className="flex items-center gap-3 rounded-2xl px-3 py-2 transition"
            style={{
              backgroundColor: isCurrent ? '#241e4d' : '#171331',
              border: `2px solid ${isCurrent ? '#fde047' : '#332b63'}`,
            }}
          >
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0"
              style={{ backgroundColor: player.color }}
            >
              {player.avatar}
            </span>
            <span className="text-slate-100 font-semibold truncate flex-1">{player.name}</span>
            <div className="flex gap-1">
              {CATEGORIES.map((category) => {
                const owned = player.wedges.has(category.id)
                return (
                  <span
                    key={category.id}
                    title={category.label}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                    style={{
                      backgroundColor: owned ? category.color : '#241e4d',
                      opacity: owned ? 1 : 0.45,
                      boxShadow: owned ? `0 0 0 2px ${category.color}55` : 'none',
                    }}
                  >
                    {owned ? '🧀' : category.icon}
                  </span>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
