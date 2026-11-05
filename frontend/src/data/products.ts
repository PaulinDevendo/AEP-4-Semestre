export type ArtKind = 'rouge' | 'essence' | 'blush' | 'velvet'

/** Espelha `categoria` (nome, slug, descricao, ordem). */
export interface Category {
  slug: string
  name: string
  description: string
}

/** Espelha `produto` (nome, descricao, preco, cor_hex, estoque). `tag` e `slug` existem só no front. */
export interface Product {
  id: string // slug derivado do nome; o id numérico virá da API
  name: string
  price: number
  tag: string
  art: ArtKind
  category: string // slug da categoria
  description: string
  colorHex: string
  stock: number
  featured?: boolean
}

export const categories: Category[] = [
  { slug: 'batons', name: 'Batons', description: 'Cores intensas, acabamento cremoso e longa duração.' },
  { slug: 'esmaltes', name: 'Esmaltes', description: 'Cores vibrantes, secagem rápida e brilho de salão.' },
  { slug: 'rosto', name: 'Rosto', description: 'Bases, blushes e iluminadores para uma pele uniforme.' },
  { slug: 'skincare', name: 'Skincare', description: 'Rituais de cuidado para hidratar, tratar e proteger.' },
  { slug: 'acessorios', name: 'Acessórios', description: 'Pincéis, esponjas e necessaires para o dia a dia.' },
]

export const catalog: Product[] = [
  // Batons
  { id: 'rouge-intense', name: 'Rouge Intense', price: 49.9, tag: 'Batom cremoso · Vermelho', art: 'rouge', category: 'batons', colorHex: '#B3263F', stock: 40, featured: true, description: 'Batom cremoso de cor intensa e acabamento acetinado. Hidrata enquanto colore.' },
  { id: 'rosa-antigo', name: 'Rosa Violáceo', price: 44.9, tag: 'Batom matte · Rosa', art: 'rouge', category: 'batons', colorHex: '#B76B7D', stock: 35, description: 'Batom matte de textura aveludada em um rosa clássico para o dia a dia.' },
  { id: 'nude-seda', name: 'Nude Laço', price: 44.9, tag: 'Batom cremoso · Nude', art: 'rouge', category: 'batons', colorHex: '#C98F86', stock: 28, description: 'Nude quente que combina com todos os tons de pele, com toque de seda.' },
  { id: 'bordo-noturno', name: 'Bordô Noturno', price: 54.9, tag: 'Batom matte · Bordô', art: 'rouge', category: 'batons', colorHex: '#6E1A2E', stock: 22, description: 'Bordô profundo e sofisticado, ideal para ocasiões especiais.' },

  // Esmaltes
  { id: 'esmalte-vermelho-vivo', name: 'Esmalte Vermelho Vivo', price: 19.9, tag: 'Esmalte cremoso · 9 ml', art: 'rouge', category: 'esmaltes', colorHex: '#C8102E', stock: 80, description: 'O novo vermelho vivo da coleção: cobertura em duas camadas e brilho espelhado.' },
  { id: 'esmalte-rosa-chiclete', name: 'Esmalte Rosa Névoa', price: 17.9, tag: 'Esmalte cremoso · 9 ml', art: 'blush', category: 'esmaltes', colorHex: '#E8A0B4', stock: 60, description: 'Rosa suave e luminoso, de secagem rápida.' },
  { id: 'esmalte-nude-po', name: 'Esmalte Nude Posse', price: 17.9, tag: 'Esmalte cremoso · 9 ml', art: 'velvet', category: 'esmaltes', colorHex: '#D7B8A8', stock: 55, description: 'Nude empoeirado que alonga e uniformiza as unhas.' },
  { id: 'base-fortalecedora', name: 'Base Fortalecedora', price: 22.9, tag: 'Base para unhas · 9 ml', art: 'essence', category: 'esmaltes', colorHex: '#F1DCBF', stock: 45, description: 'Fortalece e protege as unhas antes da cor.' },

  // Rosto
  { id: 'velvet-skin', name: 'Velvet Skin Toque', price: 69.9, tag: 'Base acetinada · 12 tons', art: 'velvet', category: 'rosto', colorHex: '#E3B7A0', stock: 30, featured: true, description: 'Base de cobertura média com acabamento acetinado, em 12 tons.' },
  { id: 'blush-romantic', name: 'Blush Romantic', price: 39.9, tag: 'Blush compacto · Rosa antigo', art: 'blush', category: 'rosto', colorHex: '#D98B9B', stock: 38, featured: true, description: 'Blush compacto de pigmento macio que se constrói em camadas.' },
  { id: 'po-translucido', name: 'Pó Invisível', price: 52.9, tag: 'Pó solto · 10 g', art: 'velvet', category: 'rosto', colorHex: '#F3DCCB', stock: 26, description: 'Sela a maquiagem e controla o brilho sem pesar.' },
  { id: 'glow-iluminador', name: 'Glow Vigia', price: 59.9, tag: 'Iluminador líquido · 15 ml', art: 'essence', category: 'rosto', colorHex: '#EBCBD3', stock: 24, description: 'Luminosidade perolada para as maçãs do rosto.' },

  // Skincare
  { id: 'essence-rose', name: 'Essence Rosé', price: 89.9, tag: 'Sérum iluminador · 30 ml', art: 'essence', category: 'skincare', colorHex: '#EBCBD3', stock: 20, featured: true, description: 'Sérum iluminador com extrato de rosa que uniformiza o viço da pele.' },
  { id: 'creme-hidratante', name: 'Creme Reparador', price: 74.9, tag: 'Hidratante · 50 g', art: 'essence', category: 'skincare', colorHex: '#F8EDEF', stock: 33, description: 'Hidratação leve por 24 horas, para todos os tipos de pele.' },
  { id: 'agua-micelar', name: 'Água Micelar', price: 36.9, tag: 'Demaquilante · 200 ml', art: 'essence', category: 'skincare', colorHex: '#EAF1F4', stock: 50, description: 'Remove a maquiagem e limpa suavemente, sem enxágue.' },
  { id: 'protetor-solar', name: 'Protetor Escudo FPS 50', price: 64.9, tag: 'Protetor · 40 g', art: 'essence', category: 'skincare', colorHex: '#F6E6D0', stock: 41, description: 'Toque seco, sem resíduo branco e com cor universal.' },

  // Acessórios
  { id: 'kit-pinceis', name: 'Kit Pincéis Cerca', price: 79.9, tag: 'Kit com 6 pincéis', art: 'velvet', category: 'acessorios', colorHex: '#B76B7D', stock: 18, description: 'Seis pincéis de cerdas macias para rosto e olhos.' },
  { id: 'esponja-rosa', name: 'Esponja Rosa', price: 19.9, tag: 'Esponja para base', art: 'blush', category: 'acessorios', colorHex: '#E8A0B4', stock: 70, description: 'Esponja de acabamento uniforme, suave para a pele.' },
  { id: 'necessaire-seda', name: 'Necessaire Cofre', price: 49.9, tag: 'Necessaire · Rosé', art: 'velvet', category: 'acessorios', colorHex: '#EBCBD3', stock: 25, description: 'Necessaire com forro impermeável e fecho discreto.' },
  { id: 'espelho-bolso', name: 'Espelho Eco', price: 24.9, tag: 'Espelho duplo', art: 'blush', category: 'acessorios', colorHex: '#C9A27A', stock: 60, description: 'Espelho duplo com aumento, perfeito para a bolsa.' },
]

/** Destaques da Home. */
export const products: Product[] = catalog.filter((p) => p.featured)

export const getProduct = (id: string) => catalog.find((p) => p.id === id)
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug)
export const byCategory = (slug: string) => catalog.filter((p) => p.category === slug)

export const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
