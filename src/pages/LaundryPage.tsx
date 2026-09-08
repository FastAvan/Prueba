import { useEffect, useRef, useState } from 'react'
import Card from '../components/Card'
import { useLocalStore } from '../lib/storage'
import { ensureNotificationPermission, notify } from '../lib/notifications'
import type { Machine, MachineType } from '../types'
import { DEFAULT_MACHINES } from '../data/defaultData'

const TYPE_LABEL: Record<MachineType, string> = {
  lavadora: 'Lavadora',
  secadora: 'Secadora',
  cocina: 'Cocina / horno',
}

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function LaundryPage() {
  const [machines, setMachines] = useLocalStore<Machine[]>('machines', DEFAULT_MACHINES)
  const [, setTick] = useState(0)
  const [notifOn, setNotifOn] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted',
  )
  const [minutesDraft, setMinutesDraft] = useState<Record<string, number>>({})
  const notified = useRef<Set<string>>(new Set())

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const now = Date.now()
    for (const m of machines) {
      if (m.endTime && m.endTime <= now && !notified.current.has(m.id)) {
        notified.current.add(m.id)
        notify('¡Listo!', `${m.name} ha terminado.`)
      }
      if (!m.endTime) notified.current.delete(m.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machines])

  async function enableNotifications() {
    const ok = await ensureNotificationPermission()
    setNotifOn(ok)
  }

  function start(machine: Machine) {
    const minutes = minutesDraft[machine.id] ?? machine.defaultMinutes
    setMachines((prev) =>
      prev.map((m) => (m.id === machine.id ? { ...m, endTime: Date.now() + minutes * 60_000 } : m)),
    )
  }

  function stop(machine: Machine) {
    setMachines((prev) => prev.map((m) => (m.id === machine.id ? { ...m, endTime: null } : m)))
    notified.current.delete(machine.id)
  }

  const grouped = machines.reduce<Record<MachineType, Machine[]>>(
    (acc, m) => {
      acc[m.type] = acc[m.type] ?? []
      acc[m.type].push(m)
      return acc
    },
    { lavadora: [], secadora: [], cocina: [] },
  )

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-4">
      {!notifOn && (
        <Card>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-400">
              Activa los avisos para que te notifique cuando termine cada máquina.
            </p>
            <button
              onClick={enableNotifications}
              className="whitespace-nowrap rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white"
            >
              Activar avisos
            </button>
          </div>
        </Card>
      )}

      {(Object.keys(grouped) as MachineType[]).map((type) =>
        grouped[type].length === 0 ? null : (
          <Card key={type} title={`${TYPE_LABEL[type]}s`}>
            <div className="flex flex-col gap-3">
              {grouped[type].map((m) => {
                const running = !!m.endTime && m.endTime > Date.now()
                const remaining = m.endTime ? m.endTime - Date.now() : 0
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2"
                  >
                    <div>
                      <p className="font-medium">{m.name}</p>
                      {running ? (
                        <p className="text-2xl font-mono text-emerald-400">
                          {formatRemaining(remaining)}
                        </p>
                      ) : m.endTime ? (
                        <p className="text-sm text-emerald-400">Terminado</p>
                      ) : (
                        <p className="text-sm text-slate-500">Libre</p>
                      )}
                    </div>

                    {running || m.endTime ? (
                      <button
                        onClick={() => stop(m)}
                        className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm font-medium"
                      >
                        {running ? 'Cancelar' : 'Liberar'}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          className="w-16 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-sm"
                          value={minutesDraft[m.id] ?? m.defaultMinutes}
                          onChange={(e) =>
                            setMinutesDraft((prev) => ({
                              ...prev,
                              [m.id]: Number(e.target.value) || m.defaultMinutes,
                            }))
                          }
                        />
                        <span className="text-xs text-slate-500">min</span>
                        <button
                          onClick={() => start(m)}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white"
                        >
                          Iniciar
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        ),
      )}
    </div>
  )
}
