export type POICategory =
  | 'residencia'
  | 'metro'
  | 'super'
  | 'lavanderia'
  | 'ocio'
  | 'salud'
  | 'otro'

export interface POI {
  id: string
  name: string
  category: POICategory
  lat: number
  lng: number
  note?: string
}

export type MachineType = 'lavadora' | 'secadora' | 'cocina'

export interface Machine {
  id: string
  name: string
  type: MachineType
  defaultMinutes: number
  /** epoch ms cuando termina el temporizador activo, o null si está libre */
  endTime: number | null
}

export type RoomType = 'sala' | 'cine'

export interface Room {
  id: string
  name: string
  type: RoomType
  description?: string
}

export interface Booking {
  id: string
  roomId: string
  /** fecha en formato YYYY-MM-DD */
  date: string
  /** hora de inicio, 0-23 */
  startHour: number
  durationHours: number
  personName: string
  note?: string
}

export type MealSlot = 'comida' | 'cena'

export interface MenuEntry {
  /** 0 = lunes ... 6 = domingo */
  day: number
  meal: MealSlot
  dish: string
}

export interface PersonalMenuChoice {
  /** clave `${day}-${meal}` */
  key: string
  chosen: boolean
}

export interface ResidenciaConfig {
  name: string
  lat: number
  lng: number
}
