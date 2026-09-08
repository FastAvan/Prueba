import { divIcon } from 'leaflet'
import type { POICategory } from '../types'

const EMOJI: Record<POICategory, string> = {
  residencia: '🏢',
  metro: '🚇',
  super: '🛒',
  lavanderia: '🧺',
  ocio: '🎬',
  salud: '⚕️',
  otro: '📍',
}

export const CATEGORY_LABEL: Record<POICategory, string> = {
  residencia: 'Residencia',
  metro: 'Metro / Cercanías',
  super: 'Supermercado',
  lavanderia: 'Lavandería',
  ocio: 'Ocio',
  salud: 'Salud / Farmacia',
  otro: 'Otro',
}

export function poiIcon(category: POICategory) {
  return divIcon({
    html: `<div style="font-size:22px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,.6))">${EMOJI[category]}</div>`,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}
