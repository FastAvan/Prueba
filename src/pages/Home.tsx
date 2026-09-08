import { Link } from 'react-router-dom'
import Card from '../components/Card'
import { useLocalStore } from '../lib/storage'
import type { Booking, Machine, MenuEntry, ResidenciaConfig } from '../types'
import { DEFAULT_MACHINES, DEFAULT_MENU, DEFAULT_RESIDENCIA, DIAS_SEMANA } from '../data/defaultData'

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function Home() {
  const [residencia] = useLocalStore<ResidenciaConfig>('residencia', DEFAULT_RESIDENCIA)
  const [machines] = useLocalStore<Machine[]>('machines', DEFAULT_MACHINES)
  const [bookings] = useLocalStore<Booking[]>('bookings', [])
  const [menu] = useLocalStore<MenuEntry[]>('menu', DEFAULT_MENU)

  const busyMachines = machines.filter((m) => m.endTime && m.endTime > Date.now())
  const today = todayIso()
  const todaysBookings = bookings
    .filter((b) => b.date === today)
    .sort((a, b) => a.startHour - b.startHour)

  const jsDay = new Date().getDay()
  const dayIndex = jsDay === 0 ? 6 : jsDay - 1
  const todaysMenu = menu.filter((m) => m.day === dayIndex)

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-4">
      <div>
        <p className="text-sm text-slate-400">Hola 👋</p>
        <h2 className="text-xl font-semibold">{residencia.name}</h2>
      </div>

      <Card title="Lavandería / cocina en uso">
        {busyMachines.length === 0 ? (
          <p className="text-sm text-slate-400">Ninguna máquina en marcha ahora mismo.</p>
        ) : (
          <ul className="flex flex-col gap-1 text-sm">
            {busyMachines.map((m) => (
              <li key={m.id} className="flex justify-between">
                <span>{m.name}</span>
                <span className="text-emerald-400">
                  libre a las{' '}
                  {new Date(m.endTime!).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
        <Link to="/lavanderia" className="mt-3 inline-block text-sm text-emerald-400 underline">
          Ir a temporizadores →
        </Link>
      </Card>

      <Card title={`Menú de hoy (${DIAS_SEMANA[dayIndex]})`}>
        {todaysMenu.length === 0 ? (
          <p className="text-sm text-slate-400">Aún no hay menú cargado para hoy.</p>
        ) : (
          <ul className="text-sm">
            {todaysMenu.map((m) => (
              <li key={m.meal} className="flex justify-between py-0.5">
                <span className="capitalize text-slate-400">{m.meal}</span>
                <span>{m.dish}</span>
              </li>
            ))}
          </ul>
        )}
        <Link to="/menu" className="mt-3 inline-block text-sm text-emerald-400 underline">
          Ver / editar menú →
        </Link>
      </Card>

      <Card title="Próximas reservas de hoy">
        {todaysBookings.length === 0 ? (
          <p className="text-sm text-slate-400">No hay reservas para hoy.</p>
        ) : (
          <ul className="text-sm">
            {todaysBookings.map((b) => (
              <li key={b.id} className="flex justify-between py-0.5">
                <span>
                  {b.startHour}:00 - {b.startHour + b.durationHours}:00
                </span>
                <span className="text-slate-400">{b.personName}</span>
              </li>
            ))}
          </ul>
        )}
        <Link to="/reservas" className="mt-3 inline-block text-sm text-emerald-400 underline">
          Ir a reservas →
        </Link>
      </Card>

      <Card title="Mapa de la ciudad">
        <p className="text-sm text-slate-400">
          Metro, supermercados y puntos útiles cerca de la residencia.
        </p>
        <Link to="/mapa" className="mt-3 inline-block text-sm text-emerald-400 underline">
          Abrir mapa →
        </Link>
      </Card>
    </div>
  )
}
