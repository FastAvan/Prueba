const PIPS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
}

interface DiceProps {
  value: number | null
  rolling: boolean
}

export default function Dice({ value, rolling }: DiceProps) {
  const shown = value ?? 1
  return (
    <svg viewBox="0 0 100 100" className={`w-16 h-16 drop-shadow-lg ${rolling ? 'animate-spin' : ''}`}>
      <rect x={5} y={5} width={90} height={90} rx={18} fill="#fefce8" stroke="#7c3aed" strokeWidth={4} />
      {PIPS[shown].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={8} fill="#7c3aed" />
      ))}
    </svg>
  )
}
