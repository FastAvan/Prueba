import { useEffect, useState } from 'react'
import { CATEGORY_BY_ID } from '../data/categories'
import type { Player, Question } from '../types'

interface QuestionModalProps {
  question: Question
  player: Player
  isHub: boolean
  onResolved: (correct: boolean) => void
  onContinue: () => void
}

const TIME_LIMIT = 20

export default function QuestionModal({ question, player, isHub, onResolved, onContinue }: QuestionModalProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [timedOut, setTimedOut] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const category = CATEGORY_BY_ID[question.category]
  const answered = selected !== null || timedOut

  useEffect(() => {
    if (answered) return
    if (timeLeft <= 0) {
      setTimedOut(true)
      onResolved(false)
      return
    }
    const timer = window.setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, answered])

  const handleSelect = (index: number) => {
    if (answered) return
    setSelected(index)
    onResolved(index === question.correctIndex)
  }

  const timePct = Math.max(0, (timeLeft / TIME_LIMIT) * 100)
  const timeBarColor = timePct > 50 ? '#4ade80' : timePct > 20 ? '#facc15' : '#f87171'

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-bounce-in" style={{ backgroundColor: '#171331' }}>
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ background: `linear-gradient(120deg, ${category.color}, ${category.colorDark})` }}
        >
          <span className="flex items-center gap-2 font-bold text-white">
            <span className="text-xl">{category.icon}</span>
            {category.label} {isHub ? '· quesito 🧀' : ''}
          </span>
          <span className="text-white/90 text-sm font-medium">
            {player.avatar} {player.name}
          </span>
        </div>

        <div className="h-2 bg-black/30">
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{ width: `${timePct}%`, backgroundColor: timeBarColor }}
          />
        </div>

        <div className="p-6 flex flex-col gap-5">
          <p className="text-lg text-slate-100 font-semibold leading-snug">{question.question}</p>

          <div className="grid grid-cols-1 gap-2.5">
            {question.options.map((option, index) => {
              const isCorrect = index === question.correctIndex
              const isSelected = index === selected
              let style = 'border-slate-700 hover:border-cyan-400 hover:bg-white/5'
              let bg = '#211c47'
              if (answered && isCorrect) {
                style = 'border-green-400 text-green-200'
                bg = '#14532d'
              } else if (answered && isSelected && !isCorrect) {
                style = 'border-red-400 text-red-200'
                bg = '#7f1d1d'
              } else if (answered) {
                style = 'border-slate-800 text-slate-500'
                bg = '#1b1738'
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(index)}
                  disabled={answered}
                  style={{ backgroundColor: bg }}
                  className={`text-left px-4 py-3 rounded-xl border-2 transition text-slate-100 font-medium ${style}`}
                >
                  {option}
                </button>
              )
            })}
          </div>

          {answered && (
            <div className="flex items-center justify-between">
              <span className={selected === question.correctIndex ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                {timedOut ? '⏱️ ¡Se acabó el tiempo!' : selected === question.correctIndex ? '¡Correcto! 🎉' : 'Incorrecto'}
              </span>
              <button
                onClick={onContinue}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:brightness-110 text-white font-bold px-5 py-2.5 rounded-xl shadow-[0_3px_0_0_#1e40af] active:translate-y-0.5 active:shadow-none transition"
              >
                Continuar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
