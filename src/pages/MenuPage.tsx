import { useState } from 'react'
import Card from '../components/Card'
import { useLocalStore } from '../lib/storage'
import type { MealSlot, MenuEntry, PersonalMenuChoice } from '../types'
import { DEFAULT_MENU, DIAS_SEMANA } from '../data/defaultData'

const MEALS: MealSlot[] = ['comida', 'cena']

function keyOf(day: number, meal: MealSlot) {
  return `${day}-${meal}`
}

export default function MenuPage() {
  const [menu, setMenu] = useLocalStore<MenuEntry[]>('menu', DEFAULT_MENU)
  const [personal, setPersonal] = useLocalStore<PersonalMenuChoice[]>('personalMenu', [])
  const [copied, setCopied] = useState(false)
  const [pasting, setPasting] = useState(false)
  const [pasteText, setPasteText] = useState('')

  function getDish(day: number, meal: MealSlot): string {
    return menu.find((m) => m.day === day && m.meal === meal)?.dish ?? ''
  }

  function setDish(day: number, meal: MealSlot, dish: string) {
    setMenu((prev) => {
      const exists = prev.some((m) => m.day === day && m.meal === meal)
      if (!dish.trim()) return prev.filter((m) => !(m.day === day && m.meal === meal))
      if (exists) return prev.map((m) => (m.day === day && m.meal === meal ? { ...m, dish } : m))
      return [...prev, { day, meal, dish }]
    })
  }

  function isChosen(day: number, meal: MealSlot): boolean {
    return personal.find((p) => p.key === keyOf(day, meal))?.chosen ?? false
  }

  function toggleChosen(day: number, meal: MealSlot) {
    const key = keyOf(day, meal)
    setPersonal((prev) => {
      const exists = prev.find((p) => p.key === key)
      if (exists) return prev.map((p) => (p.key === key ? { ...p, chosen: !p.chosen } : p))
      return [...prev, { key, chosen: true }]
    })
  }

  async function shareMenu() {
    await navigator.clipboard.writeText(JSON.stringify(menu))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function importMenu() {
    try {
      const parsed = JSON.parse(pasteText) as MenuEntry[]
      setMenu(parsed)
      setPasting(false)
      setPasteText('')
    } catch {
      alert('El texto pegado no es un menú válido.')
    }
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-4">
      <Card>
        <p className="text-sm text-slate-400">
          Escribe aquí el menú semanal de la residencia. Se guarda solo en este navegador: usa
          "Compartir" para copiarlo y pegarlo en el grupo, o "Pegar menú" para traer el que copió
          otra persona.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={shareMenu}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white"
          >
            {copied ? 'Copiado ✓' : 'Compartir menú'}
          </button>
          <button
            onClick={() => setPasting((p) => !p)}
            className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm font-medium"
          >
            Pegar menú
          </button>
        </div>
        {pasting && (
          <div className="mt-3 flex flex-col gap-2">
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Pega aquí el texto copiado"
              rows={3}
              className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-sm"
            />
            <button
              onClick={importMenu}
              className="self-start rounded-lg bg-emerald-600 px-3 py-1 text-sm font-medium text-white"
            >
              Importar
            </button>
          </div>
        )}
      </Card>

      {DIAS_SEMANA.map((dia, day) => (
        <Card key={dia} title={dia}>
          <div className="flex flex-col gap-2">
            {MEALS.map((meal) => (
              <div key={meal} className="flex items-center gap-2">
                <button
                  onClick={() => toggleChosen(day, meal)}
                  title="Marcar que voy a comer esto"
                  className={`text-lg ${isChosen(day, meal) ? '' : 'opacity-30'}`}
                >
                  ⭐
                </button>
                <span className="w-14 shrink-0 text-xs capitalize text-slate-400">{meal}</span>
                <input
                  value={getDish(day, meal)}
                  onChange={(e) => setDish(day, meal, e.target.value)}
                  placeholder="Sin definir"
                  className="min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-sm outline-none focus:border-emerald-500"
                />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}
