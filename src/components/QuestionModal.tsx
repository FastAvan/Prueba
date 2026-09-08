import { useState } from 'react'
import { CATEGORY_BY_ID } from '../data/categories'
import type { Player, Question } from '../types'

interface QuestionModalProps {
  question: Question
  player: Player
  isHub: boolean
  onResolved: (correct: boolean) => void
  onContinue: () => void
}

export default function QuestionModal({ question, player, isHub, onResolved, onContinue }: QuestionModalProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const category = CATEGORY_BY_ID[question.category]
  const answered = selected !== null

  const handleSelect = (index: number) => {
    if (answered) return
    setSelected(index)
    onResolved(index === question.correctIndex)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold text-slate-900"
            style={{ backgroundColor: category.color }}
          >
            {category.label} {isHub ? '· quesito 🧀' : ''}
          </span>
          <span className="text-slate-400 text-sm">Turno de {player.name}</span>
        </div>

        <p className="text-lg text-slate-100 font-medium leading-snug">{question.question}</p>

        <div className="grid grid-cols-1 gap-2">
          {question.options.map((option, index) => {
            const isCorrect = index === question.correctIndex
            const isSelected = index === selected
            let style = 'border-slate-700 bg-slate-800 hover:border-sky-500'
            if (answered && isCorrect) style = 'border-green-500 bg-green-950 text-green-300'
            else if (answered && isSelected && !isCorrect) style = 'border-red-500 bg-red-950 text-red-300'
            else if (answered) style = 'border-slate-800 bg-slate-800/50 text-slate-500'

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={answered}
                className={`text-left px-4 py-3 rounded-lg border transition text-slate-100 ${style}`}
              >
                {option}
              </button>
            )
          })}
        </div>

        {answered && (
          <div className="flex items-center justify-between">
            <span className={selected === question.correctIndex ? 'text-green-400' : 'text-red-400'}>
              {selected === question.correctIndex ? '¡Correcto!' : 'Incorrecto'}
            </span>
            <button
              onClick={onContinue}
              className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-5 py-2 rounded-lg"
            >
              Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
