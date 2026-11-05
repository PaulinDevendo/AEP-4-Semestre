import { createStore } from '../lib/createStore'

/** Sacola em memória: { idDoProduto: quantidade }. */
const store = createStore<Record<string, number>>({})

export const useCart = store.use
export const getCart = store.get
export const addToCart = (id: string) => store.set((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
export const setQty = (id: string, q: number) =>
  store.set((c) => { const n = { ...c }; if (q <= 0) delete n[id]; else n[id] = Math.min(q, 9); return n })
export const clearCart = () => store.set({})
export const useCartCount = () => Object.values(store.use()).reduce((a, b) => a + b, 0)

/** Pedido confirmado (compra "normal"). Só vira ocorrência se ela tocar em "Acertar com vendedor". */
export interface Order { number: number; items: { id: string; qty: number }[]; conversaId: number | null }
export const order = createStore<Order | null>(null)
