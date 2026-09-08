import { useMemo, useState } from 'react'
import Card from '../components/Card'
import { useLocalStore } from '../lib/storage'
import { newId } from '../lib/id'
import type { Booking, Room } from '../types'
import { DEFAULT_ROOMS } from '../data/defaultData'

const HOURS = Array.from({ length: 16 }, (_, i) => 8 + i) // 08:00 - 23:00

function todayIso(offsetDays = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

function formatDateLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function BookingsPage() {
  const [rooms] = useLocalStore<Room[]>('rooms', DEFAULT_ROOMS)
  const [bookings, setBookings] = useLocalStore<Booking[]>('bookings', [])
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? '')
  const [date, setDate] = useState(todayIso())
  const [pendingHour, setPendingHour] = useState<number | null>(null)
  const [duration, setDuration] = useState(1)
  const [personName, setPersonName] = useState('')

  const activeRoomId = rooms.some((r) => r.id === roomId) ? roomId : rooms[0]?.id ?? ''

  const dayBookings = useMemo(
    () => bookings.filter((b) => b.roomId === activeRoomId && b.date === date),
    [bookings, activeRoomId, date],
  )

  function bookingAt(hour: number): Booking | undefined {
    return dayBookings.find((b) => hour >= b.startHour && hour < b.startHour + b.durationHours)
  }

  function hasOverlap(startHour: number, durationHours: number): boolean {
    return dayBookings.some(
      (b) => startHour < b.startHour + b.durationHours && startHour + durationHours > b.startHour,
    )
  }

  function confirmBooking() {
    if (pendingHour === null || !personName.trim()) return
    if (hasOverlap(pendingHour, duration)) {
      alert('Esa franja ya está reservada, elige otra.')
      return
    }
    setBookings((prev) => [
      ...prev,
      {
        id: newId(),
        roomId: activeRoomId,
        date,
        startHour: pendingHour,
        durationHours: duration,
        personName: personName.trim(),
      },
    ])
    setPendingHour(null)
    setPersonName('')
    setDuration(1)
  }

  function cancelBooking(id: string) {
    setBookings((prev) => prev.filter((b) => b.id !== id))
  }

  const nextDays = Array.from({ length: 10 }, (_, i) => todayIso(i))

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-4">
      <Card>
        <p className="text-sm text-slate-400">
          Las reservas se guardan solo en este navegador (no hay backend compartido todavía), así
          que para evitar solapes reales conviene seguir avisando también por el grupo de la
          residencia.
        </p>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => setRoomId(room.id)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm ${
              activeRoomId === room.id
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {room.type === 'cine' ? '🎬 ' : '🛋️ '}
            {room.name}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {nextDays.map((d) => (
          <button
            key={d}
            onClick={() => setDate(d)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs capitalize ${
              date === d ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {formatDateLabel(d)}
          </button>
        ))}
      </div>

      <Card>
        <div className="flex flex-col gap-1.5">
          {HOURS.map((hour) => {
            const booking = bookingAt(hour)
            const isStart = booking?.startHour === hour
            return (
              <div key={hour} className="flex items-center gap-2">
                <span className="w-10 shrink-0 text-xs text-slate-500">{hour}:00</span>
                {booking ? (
                  isStart ? (
                    <div className="flex flex-1 items-center justify-between rounded-md bg-emerald-900/40 px-3 py-1.5 text-sm">
                      <span>
                        {booking.personName} · {booking.durationHours}h
                      </span>
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="text-xs text-red-400 underline"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 rounded-md bg-emerald-900/10 px-3 py-1.5 text-sm text-transparent">
                      .
                    </div>
                  )
                ) : pendingHour === hour ? (
                  <div className="flex flex-1 flex-wrap items-center gap-2 rounded-md bg-slate-800 px-3 py-1.5">
                    <input
                      autoFocus
                      value={personName}
                      onChange={(e) => setPersonName(e.target.value)}
                      placeholder="Tu nombre"
                      className="min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm outline-none focus:border-emerald-500"
                    />
                    <select
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
                    >
                      {[1, 2, 3, 4].map((h) => (
                        <option key={h} value={h}>
                          {h}h
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={confirmBooking}
                      disabled={!personName.trim()}
                      className="rounded-md bg-emerald-600 px-2 py-1 text-sm font-medium text-white disabled:opacity-40"
                    >
                      Reservar
                    </button>
                    <button
                      onClick={() => setPendingHour(null)}
                      className="text-xs text-slate-400 underline"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setPendingHour(hour)
                      setPersonName('')
                      setDuration(1)
                    }}
                    className="flex-1 rounded-md border border-dashed border-slate-700 py-1.5 text-left text-sm text-slate-500 hover:border-emerald-600 hover:text-emerald-400"
                  >
                    Libre
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
