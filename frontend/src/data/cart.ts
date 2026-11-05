import { createStore } from '../lib/createStore'

/** Sacola em memória. Na fase 3 vira `ocorrencia` + `ocorrencia_item` (origem 'pedido_web'). */
const store = createStore<Record<string, number>>({})

export const addToCart = (id: string) => store.set((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
export const useCartCount = () => Object.values(store.use()).reduce((a, b) => a + b, 0)
