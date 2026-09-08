import { CATEGORIES } from '../data/categories'
import type { Player } from '../types'

interface ScoreboardProps {
  players: Player[]
  currentPlayerId: string
}

export default function Scoreboard({ players, currentPlayerId }: ScoreboardProps) {
  return (
    <div className="flex flex-col gap-2">
      {players.map((player) => (
        <div
          key={player.id}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 border transition ${
            player.id === currentPlayerId
              ? 'border-yellow-400/60 bg-slate-800'
              : 'border-slate-800 bg-slate-900'
          }`}
        >
          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: player.color }} />
          <span className="text-slate-100 font-medium truncate flex-1">{player.name}</span>
          <div className="flex gap-1">
            {CATEGORIES.map((category) => (
              <span
                key={category.id}
                title={category.label}
                className="w-4 h-4 rounded-full flex items-center justify-center text-[9px]"
                style={{
                  backgroundColor: player.wedges.has(category.id) ? category.color : '#1e293b',
                  opacity: player.wedges.has(category.id) ? 1 : 0.5,
                }}
              >
                {player.wedges.has(category.id) ? '🧀' : ''}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
