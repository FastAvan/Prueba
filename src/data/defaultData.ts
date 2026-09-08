import type { Machine, MenuEntry, POI, ResidenciaConfig, Room } from '../types'

export const DEFAULT_RESIDENCIA: ResidenciaConfig = {
  name: 'Mi Residencia',
  lat: 40.4383,
  lng: -3.7276,
}

export const DEFAULT_POIS: POI[] = [
  {
    id: 'seed-residencia',
    name: 'Mi Residencia',
    category: 'residencia',
    lat: 40.4383,
    lng: -3.7276,
  },
  {
    id: 'seed-metro-moncloa',
    name: 'Metro Moncloa',
    category: 'metro',
    lat: 40.4347,
    lng: -3.7189,
  },
  {
    id: 'seed-super',
    name: 'Supermercado',
    category: 'super',
    lat: 40.4361,
    lng: -3.7245,
  },
]

export const DEFAULT_MACHINES: Machine[] = [
  { id: 'seed-lav-1', name: 'Lavadora 1', type: 'lavadora', defaultMinutes: 60, endTime: null },
  { id: 'seed-lav-2', name: 'Lavadora 2', type: 'lavadora', defaultMinutes: 60, endTime: null },
  { id: 'seed-sec-1', name: 'Secadora 1', type: 'secadora', defaultMinutes: 45, endTime: null },
  { id: 'seed-horno-1', name: 'Horno cocina', type: 'cocina', defaultMinutes: 30, endTime: null },
]

export const DEFAULT_ROOMS: Room[] = [
  { id: 'seed-sala-estudio', name: 'Sala de estudio', type: 'sala' },
  { id: 'seed-sala-comun', name: 'Sala común', type: 'sala' },
  { id: 'seed-cine', name: 'Sala de cine', type: 'cine' },
]

export const DEFAULT_MENU: MenuEntry[] = []

export const DIAS_SEMANA = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
]
