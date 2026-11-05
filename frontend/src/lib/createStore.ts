import { useSyncExternalStore } from 'react'

/** Store mínima em memória (sem localStorage: não deixa rastro no navegador). */
export function createStore<T>(initial: T) {
  let state = initial
  const listeners = new Set<() => void>()
  return {
    get: () => state,
    set(next: T | ((s: T) => T)) {
      state = typeof next === 'function' ? (next as (s: T) => T)(state) : next
      listeners.forEach((l) => l())
    },
    use: () =>
      useSyncExternalStore(
        (cb) => {
          listeners.add(cb)
          return () => listeners.delete(cb)
        },
        () => state,
      ),
  }
}
