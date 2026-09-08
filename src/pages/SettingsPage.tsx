import { useRef, useState } from 'react'
import Card from '../components/Card'
import { useLocalStore, exportAllData, importAllData, resetAllData } from '../lib/storage'
import { newId } from '../lib/id'
import type { Machine, MachineType, ResidenciaConfig, Room, RoomType } from '../types'
import { DEFAULT_MACHINES, DEFAULT_RESIDENCIA, DEFAULT_ROOMS } from '../data/defaultData'

const MACHINE_TYPES: MachineType[] = ['lavadora', 'secadora', 'cocina']
const ROOM_TYPES: RoomType[] = ['sala', 'cine']

export default function SettingsPage() {
  const [residencia, setResidencia] = useLocalStore<ResidenciaConfig>(
    'residencia',
    DEFAULT_RESIDENCIA,
  )
  const [machines, setMachines] = useLocalStore<Machine[]>('machines', DEFAULT_MACHINES)
  const [rooms, setRooms] = useLocalStore<Room[]>('rooms', DEFAULT_ROOMS)
  const fileInput = useRef<HTMLInputElement>(null)

  const [newMachineName, setNewMachineName] = useState('')
  const [newMachineType, setNewMachineType] = useState<MachineType>('lavadora')
  const [newMachineMinutes, setNewMachineMinutes] = useState(60)

  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomType, setNewRoomType] = useState<RoomType>('sala')

  function addMachine() {
    if (!newMachineName.trim()) return
    setMachines((prev) => [
      ...prev,
      {
        id: newId(),
        name: newMachineName.trim(),
        type: newMachineType,
        defaultMinutes: newMachineMinutes,
        endTime: null,
      },
    ])
    setNewMachineName('')
  }

  function removeMachine(id: string) {
    setMachines((prev) => prev.filter((m) => m.id !== id))
  }

  function addRoom() {
    if (!newRoomName.trim()) return
    setRooms((prev) => [...prev, { id: newId(), name: newRoomName.trim(), type: newRoomType }])
    setNewRoomName('')
  }

  function removeRoom(id: string) {
    setRooms((prev) => prev.filter((r) => r.id !== id))
  }

  function handleExport() {
    const json = exportAllData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resimadrid-datos.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportClick() {
    fileInput.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        importAllData(String(reader.result))
        alert('Datos importados. Recarga cualquier pantalla abierta para verlos.')
      } catch {
        alert('El archivo no tiene un formato válido.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleReset() {
    if (confirm('Esto borra todos los datos guardados en este navegador. ¿Continuar?')) {
      resetAllData()
    }
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-4">
      <Card title="Residencia">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-slate-400">Nombre</label>
          <input
            value={residencia.name}
            onChange={(e) => setResidencia((r) => ({ ...r, name: e.target.value }))}
            className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-sm"
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-slate-400">Latitud</label>
              <input
                type="number"
                step="0.0001"
                value={residencia.lat}
                onChange={(e) =>
                  setResidencia((r) => ({ ...r, lat: Number(e.target.value) }))
                }
                className="w-full rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-slate-400">Longitud</label>
              <input
                type="number"
                step="0.0001"
                value={residencia.lng}
                onChange={(e) =>
                  setResidencia((r) => ({ ...r, lng: Number(e.target.value) }))
                }
                className="w-full rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-sm"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Estas coordenadas centran el mapa. Puedes verlas/ajustarlas visualmente añadiendo un
            punto "Residencia" en la pestaña Mapa.
          </p>
        </div>
      </Card>

      <Card title="Lavadoras, secadoras y cocina">
        <div className="flex flex-col gap-2">
          {machines.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-md border border-slate-800 px-3 py-1.5 text-sm"
            >
              <span>
                {m.name} · {m.type} · {m.defaultMinutes} min
              </span>
              <button onClick={() => removeMachine(m.id)} className="text-xs text-red-400 underline">
                Eliminar
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            value={newMachineName}
            onChange={(e) => setNewMachineName(e.target.value)}
            placeholder="Nombre"
            className="min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-sm"
          />
          <select
            value={newMachineType}
            onChange={(e) => setNewMachineType(e.target.value as MachineType)}
            className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-sm"
          >
            {MACHINE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={newMachineMinutes}
            onChange={(e) => setNewMachineMinutes(Number(e.target.value) || 1)}
            className="w-20 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-sm"
          />
          <button
            onClick={addMachine}
            className="rounded-md bg-emerald-600 px-3 py-1 text-sm font-medium text-white"
          >
            Añadir
          </button>
        </div>
      </Card>

      <Card title="Salas y cine">
        <div className="flex flex-col gap-2">
          {rooms.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded-md border border-slate-800 px-3 py-1.5 text-sm"
            >
              <span>
                {r.name} · {r.type}
              </span>
              <button onClick={() => removeRoom(r.id)} className="text-xs text-red-400 underline">
                Eliminar
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Nombre"
            className="min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-sm"
          />
          <select
            value={newRoomType}
            onChange={(e) => setNewRoomType(e.target.value as RoomType)}
            className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-sm"
          >
            {ROOM_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button
            onClick={addRoom}
            className="rounded-md bg-emerald-600 px-3 py-1 text-sm font-medium text-white"
          >
            Añadir
          </button>
        </div>
      </Card>

      <Card title="Datos">
        <p className="text-sm text-slate-400">
          Todo se guarda solo en este navegador. Exporta un archivo para hacer copia de seguridad
          o para pasarlo a otro dispositivo tuyo.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={handleExport}
            className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm font-medium"
          >
            Exportar datos
          </button>
          <button
            onClick={handleImportClick}
            className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm font-medium"
          >
            Importar datos
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={handleReset}
            className="rounded-lg bg-red-900/60 px-3 py-1.5 text-sm font-medium text-red-200"
          >
            Borrar todo
          </button>
        </div>
      </Card>
    </div>
  )
}
