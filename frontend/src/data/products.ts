export type ArtKind = 'rouge' | 'essence' | 'blush' | 'velvet'

export interface Product {
  id: string
  name: string
  price: number
  tag: string
  art: ArtKind
}

export const products: Product[] = [
  { id: 'rouge-intense', name: 'Rouge Intense', price: 49.9, tag: 'Batom cremoso · Vermelho', art: 'rouge' },
  { id: 'essence-rose', name: 'Essence Rosé', price: 89.9, tag: 'Sérum iluminador · 30 ml', art: 'essence' },
  { id: 'blush-romantic', name: 'Blush Romantic', price: 39.9, tag: 'Blush compacto · Rosa antigo', art: 'blush' },
  { id: 'velvet-skin', name: 'Velvet Skin', price: 69.9, tag: 'Base acetinada · 12 tons', art: 'velvet' },
]

export const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
