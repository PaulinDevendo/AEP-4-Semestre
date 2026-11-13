import { useEffect } from 'react'
import { createStore } from '../lib/createStore'
import { api } from '../lib/api'

export type ArtKind = 'rouge' | 'essence' | 'blush' | 'velvet'

/** Espelha `categoria` (nome, slug, descricao, ordem). */
export interface Category { slug: string; name: string; description: string }

export interface Product {
  id: string
  dbId: number
  name: string
  price: number
  tag: string
  category: string
  description: string
  colorHex: string
  stock: number
  imageUrl: string | null
  art: ArtKind
}

const ART: Record<string, ArtKind> = {
  'esmalte-rosa-nevoa': 'blush', 'esmalte-nude-posse': 'velvet', 'base-fortalecedora': 'essence',
  'velvet-skin-toque': 'velvet', 'blush-romantic': 'blush', 'po-invisivel': 'velvet', 'glow-vigia': 'essence',
  'essence-rose': 'essence', 'creme-reparador': 'essence', 'agua-micelar': 'essence', 'protetor-escudo-fps-50': 'essence',
  'kit-pinceis-cerca': 'velvet', 'esponja-rosa': 'blush', 'necessaire-cofre': 'velvet', 'espelho-eco': 'blush',
}
const CATEGORY_ART: Record<string, ArtKind> = { batons: 'rouge', esmaltes: 'rouge', rosto: 'velvet', skincare: 'essence', acessorios: 'blush' }
const FEATURED = ['rouge-intense', 'velvet-skin-toque', 'blush-romantic', 'essence-rose']

type State = { status: 'idle' | 'loading' | 'ready' | 'error'; categories: Category[]; catalog: Product[] }
const store = createStore<State>({ status: 'idle', categories: [], catalog: [] })

export function loadCatalog(force = false) {
  const s = store.get()
  if (!force && (s.status === 'loading' || s.status === 'ready')) return
  store.set({ ...s, status: 'loading' })
  api<{ categorias: Category[]; produtos: Omit<Product, 'art'>[] }>('/catalogo')
    .then((d) => store.set({
      status: 'ready',
      categories: d.categorias,
      catalog: d.produtos.map((p) => ({ ...p, art: ART[p.id] ?? CATEGORY_ART[p.category] ?? 'essence' })),
    }))
    .catch(() => store.set({ ...store.get(), status: 'error' }))
}

export function useCatalog() {
  const s = store.use()
  useEffect(() => { loadCatalog() }, [])
  const getProduct = (id: string) => s.catalog.find((p) => p.id === id)
  return {
    ...s,
    featured: FEATURED.map(getProduct).filter((p): p is Product => !!p),
    getProduct,
    getCategory: (slug: string) => s.categories.find((c) => c.slug === slug),
    byCategory: (slug: string) => s.catalog.filter((p) => p.category === slug),
  }
}

export const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
