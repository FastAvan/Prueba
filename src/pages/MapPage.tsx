import { useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import { useLocalStore } from '../lib/storage'
import { newId } from '../lib/id'
import { poiIcon, CATEGORY_LABEL } from '../lib/poiIcons'
import type { POI, POICategory, ResidenciaConfig } from '../types'
import { DEFAULT_POIS, DEFAULT_RESIDENCIA } from '../data/defaultData'

const CATEGORIES = Object.keys(CATEGORY_LABEL) as POICategory[]

function ClickToAdd({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function MapPage() {
  const [pois, setPois] = useLocalStore<POI[]>('pois', DEFAULT_POIS)
  const [residencia] = useLocalStore<ResidenciaConfig>('residencia', DEFAULT_RESIDENCIA)
  const [picking, setPicking] = useState(false)
  const [pendingCoords, setPendingCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<POICategory>('otro')

  const center: [number, number] = [residencia.lat, residencia.lng]

  function handlePick(lat: number, lng: number) {
    if (!picking) return
    setPendingCoords({ lat, lng })
  }

  function confirmAdd() {
    if (!pendingCoords || !name.trim()) return
    setPois((prev) => [
      ...prev,
      { id: newId(), name: name.trim(), category, lat: pendingCoords.lat, lng: pendingCoords.lng },
    ])
    setName('')
    setCategory('otro')
    setPendingCoords(null)
    setPicking(false)
  }

  function removePoi(id: string) {
    setPois((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="flex h-[calc(100vh-8.5rem)] flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 bg-slate-900/60 px-4 py-2">
        <p className="text-sm text-slate-400">
          {picking ? 'Toca el mapa para colocar el punto' : 'Puntos de interés cerca de la residencia'}
        </p>
        <button
          onClick={() => {
            setPicking((p) => !p)
            setPendingCoords(null)
          }}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            picking ? 'bg-slate-700 text-slate-200' : 'bg-emerald-600 text-white'
          }`}
        >
          {picking ? 'Cancelar' : '+ Añadir punto'}
        </button>
      </div>

      {pendingCoords && (
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-900 px-4 py-2">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre (p. ej. Metro Argüelles)"
            className="min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-sm outline-none focus:border-emerald-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as POICategory)}
            className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
          <button
            onClick={confirmAdd}
            disabled={!name.trim()}
            className="rounded-md bg-emerald-600 px-3 py-1 text-sm font-medium text-white disabled:opacity-40"
          >
            Guardar
          </button>
        </div>
      )}

      <div className="relative flex-1">
        <MapContainer center={center} zoom={15} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickToAdd onPick={handlePick} />
          {pois.map((poi) => (
            <Marker key={poi.id} position={[poi.lat, poi.lng]} icon={poiIcon(poi.category)}>
              <Popup>
                <div className="text-sm">
                  <p className="font-medium">{poi.name}</p>
                  <p className="text-slate-500">{CATEGORY_LABEL[poi.category]}</p>
                  {poi.id.startsWith('seed-') === false && (
                    <button
                      onClick={() => removePoi(poi.id)}
                      className="mt-1 text-xs text-red-500 underline"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          {pendingCoords && <Marker position={[pendingCoords.lat, pendingCoords.lng]} />}
        </MapContainer>
      </div>
    </div>
  )
}
