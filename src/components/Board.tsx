import { BOARD_CELLS, BOARD_SIZE } from '../data/board'
import { CATEGORY_BY_ID } from '../data/categories'
import type { Player } from '../types'

const SIZE = 420
const CENTER = SIZE / 2
const RADIUS = 168

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
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[420px] mx-auto">
      <circle cx={CENTER} cy={CENTER} r={RADIUS + 26} fill="#0b1120" stroke="#1e293b" strokeWidth={2} />
      <circle cx={CENTER} cy={CENTER} r={70} fill="#111827" stroke="#334155" strokeWidth={2} />
      <text x={CENTER} y={CENTER - 4} textAnchor="middle" className="fill-slate-300" fontSize={13} fontWeight={700}>
        PREGUNTADOS
      </text>
      <text x={CENTER} y={CENTER + 16} textAnchor="middle" className="fill-slate-500" fontSize={11}>
        local
      </text>

      {BOARD_CELLS.map((cell) => {
        const category = CATEGORY_BY_ID[cell.category]
        const { x, y } = cellPoint(cell.index)
        const cellRadius = cell.isHub ? 17 : 11
        return (
          <g key={cell.index}>
            <circle
              cx={x}
              cy={y}
              r={cellRadius}
              fill={cell.isHub ? category.color : category.colorDark}
              stroke={cell.isHub ? '#fef08a' : '#0b1120'}
              strokeWidth={cell.isHub ? 3 : 1.5}
            />
            {cell.isHub && (
              <text x={x} y={y + 4} textAnchor="middle" fontSize={13}>
                🧀
              </text>
            )}
          </g>
        )
      })}

      {players.map((player) => {
        const cellCenter = cellPoint(player.position)
        const sameCellPlayers = players.filter((p) => p.position === player.position)
        const orderOnCell = sameCellPlayers.findIndex((p) => p.id === player.id)
        const stackOffset = (orderOnCell - (sameCellPlayers.length - 1) / 2) * 10
        const isCurrent = player.id === currentPlayerId
        return (
          <g key={player.id} transform={`translate(${cellCenter.x + stackOffset}, ${cellCenter.y - 22})`}>
            {isCurrent && (
              <circle r={9} fill="none" stroke="#fef08a" strokeWidth={2}>
                <animate attributeName="r" values="8;11;8" dur="1.2s" repeatCount="indefinite" />
              </circle>
            )}
            <circle r={7} fill={player.color} stroke="#0b1120" strokeWidth={1.5} />
            <title>{player.name}</title>
          </g>
        )
      })}
    </svg>
  )
}
