import { useCallback, useEffect, useState } from 'react'

const PREFIX = 'resimadrid:'

export const STORAGE_KEYS = [
  'pois',
  'machines',
  'rooms',
  'bookings',
  'menu',
  'personalMenu',
  'residencia',
] as const

export type StorageKey = (typeof STORAGE_KEYS)[number]

function fullKey(key: StorageKey): string {
  return `${PREFIX}${key}`
}

export function readStorage<T>(key: StorageKey, fallback: T): T {
  try {
    const raw = localStorage.getItem(fullKey(key))
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: StorageKey, value: T): void {
  localStorage.setItem(fullKey(key), JSON.stringify(value))
  window.dispatchEvent(new CustomEvent('resimadrid:change', { detail: key }))
}

/**
 * Estado respaldado por localStorage. Todo vive solo en este navegador:
 * no hay backend, así que las reservas/menús no se sincronizan entre
 * estudiantes salvo que exporten/importen el JSON manualmente.
 */
export function useLocalStore<T>(key: StorageKey, fallback: T) {
  const [value, setValue] = useState<T>(() => readStorage(key, fallback))

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<StorageKey>).detail
      if (detail === key) setValue(readStorage(key, fallback))
    }
    window.addEventListener('resimadrid:change', handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('resimadrid:change', handler)
      window.removeEventListener('storage', handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const update = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next =
          typeof updater === 'function' ? (updater as (p: T) => T)(prev) : updater
        writeStorage(key, next)
        return next
      })
    },
    [key],
  )

  return [value, update] as const
}

export function exportAllData(): string {
  const data: Record<string, unknown> = {}
  for (const key of STORAGE_KEYS) {
    const raw = localStorage.getItem(fullKey(key))
    if (raw) data[key] = JSON.parse(raw)
  }
  return JSON.stringify(data, null, 2)
}

export function importAllData(json: string): void {
  const data = JSON.parse(json) as Record<string, unknown>
  for (const key of STORAGE_KEYS) {
    if (key in data) {
      writeStorage(key, data[key])
    }
  }
}

export function resetAllData(): void {
  for (const key of STORAGE_KEYS) {
    localStorage.removeItem(fullKey(key))
    window.dispatchEvent(new CustomEvent('resimadrid:change', { detail: key }))
  }
}
