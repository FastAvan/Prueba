import { BOARD_CELLS, BOARD_SIZE } from '../data/board'
import { CATEGORY_BY_ID } from '../data/categories'
import type { Player } from '../types'

const SIZE = 440
const CENTER = SIZE / 2
const RADIUS = 172

function cellPoint(index: number, r = RADIUS) {
  const angle = (index / BOARD_SIZE) * 2 * Math.PI - Math.PI / 2
  return {
    x: CENTER + r * Math.cos(angle),
    y: CENTER + r * Math.sin(angle),
  }
}

interface BoardProps {
  players: Player[]
  currentPlayerId: string
}

export default function Board({ players, currentPlayerId }: BoardProps) {
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[440px] mx-auto drop-shadow-xl">
      <defs>
        <radialGradient id="hub-center" cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#4c1d95" />
          <stop offset="100%" stopColor="#1e1240" />
        </radialGradient>
      </defs>

      <circle cx={CENTER} cy={CENTER} r={RADIUS + 30} fill="#150f2e" stroke="#312a5e" strokeWidth={3} />
      <circle cx={CENTER} cy={CENTER} r={82} fill="url(#hub-center)" stroke="#7c3aed" strokeWidth={2} />
      <text x={CENTER} y={CENTER - 6} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fef3c7">
        PREGUNTADOS
      </text>
      <text x={CENTER} y={CENTER + 16} textAnchor="middle" fontSize={12} fill="#c4b5fd">
        modo local 🧀
      </text>

      {BOARD_CELLS.map((cell) => {
        const category = CATEGORY_BY_ID[cell.category]
        const { x, y } = cellPoint(cell.index)
        const cellRadius = cell.isHub ? 20 : 12
        return (
          <g key={cell.index}>
            {cell.isHub && (
              <circle cx={x} cy={y} r={cellRadius + 4} fill="none" stroke="#fde047" strokeWidth={2} strokeDasharray="3 3" />
            )}
            <circle
              cx={x}
              cy={y}
              r={cellRadius}
              fill={cell.isHub ? category.color : category.colorDark}
              stroke={cell.isHub ? '#fef08a' : '#0b0a1f'}
              strokeWidth={cell.isHub ? 3 : 1.5}
            />
            <text x={x} y={y + (cell.isHub ? 5 : 4)} textAnchor="middle" fontSize={cell.isHub ? 15 : 10}>
              {cell.isHub ? '🧀' : category.icon}
            </text>
          </g>
        )
      })}

      {players.map((player) => {
        const cellCenter = cellPoint(player.position)
        const sameCellPlayers = players.filter((p) => p.position === player.position)
        const orderOnCell = sameCellPlayers.findIndex((p) => p.id === player.id)
        const stackOffset = (orderOnCell - (sameCellPlayers.length - 1) / 2) * 11
        const isCurrent = player.id === currentPlayerId
        return (
          <g key={player.id} transform={`translate(${cellCenter.x + stackOffset}, ${cellCenter.y - 24})`}>
            {isCurrent && (
              <circle r={11} fill="none" stroke="#fde047" strokeWidth={2}>
                <animate attributeName="r" values="9;13;9" dur="1.1s" repeatCount="indefinite" />
              </circle>
            )}
            <circle r={9} fill={player.color} stroke="#0b0a1f" strokeWidth={1.5} />
            <text x={0} y={4} textAnchor="middle" fontSize={11}>
              {player.avatar}
            </text>
            <title>{player.name}</title>
          </g>
        )
      })}
    </svg>
  )
}
