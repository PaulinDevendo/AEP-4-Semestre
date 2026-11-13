import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { slugify, splitDescricao } from '../domain.js';

export interface ProdutoDTO {
  id: string; dbId: number; name: string; price: number; tag: string; category: string
  description: string; colorHex: string; stock: number; imageUrl: string | null
}
interface Codigo { id: number; significado: string; urgencia: string; observacao: string | null }

@Injectable()
export class CatalogoService {
  private cache: { em: number; data: Awaited<ReturnType<CatalogoService['carregar']>> } | null = null;
  constructor(private readonly db: PrismaService) {}

  private async carregar() {
    const [cats, prods, cods] = await Promise.all([
      this.db.categoria.findMany({ where: { ativo: true }, orderBy: [{ ordem: 'asc' }, { id: 'asc' }] }),
      this.db.produto.findMany({ where: { ativo: true }, orderBy: { id: 'asc' } }),
      this.db.codigo_disfarce.findMany({ where: { ativo: true }, orderBy: { id: 'desc' } }),
    ]);
    const catSlug = new Map(cats.map((c) => [c.id, c.slug]));
    const produtos: ProdutoDTO[] = prods
      .filter((p) => catSlug.has(p.categoria_id))
      .map((p) => {
        const { descricao, tag } = splitDescricao(p.descricao);
        return {
          id: slugify(p.nome), dbId: p.id, name: p.nome, price: Number(p.preco), tag,
          category: catSlug.get(p.categoria_id)!, description: descricao,
          colorHex: (p.cor_hex ?? '#EBCBD3').trim(), stock: p.estoque ?? 0, imageUrl: p.imagem_url,
        };
      });
    const porProduto = new Map<number, Codigo>();
    const porCategoria = new Map<number, Codigo>();
    for (const c of cods) {
      if (c.produto_id && !porProduto.has(c.produto_id)) porProduto.set(c.produto_id, c);
      else if (!c.produto_id && c.categoria_id && !porCategoria.has(c.categoria_id)) porCategoria.set(c.categoria_id, c);
    }
    const codigoDe = new Map<number, Codigo>();
    for (const p of prods) {
      const c = porProduto.get(p.id) ?? porCategoria.get(p.categoria_id);
      if (c) codigoDe.set(p.id, c);
    }
    const categorias = cats.map((c) => ({ slug: c.slug, name: c.nome, description: c.descricao ?? '' }));
    return { categorias, produtos, codigoDe };
  }

  async dados() {
    if (!this.cache || Date.now() - this.cache.em > 60_000) this.cache = { em: Date.now(), data: await this.carregar() };
    return this.cache.data;
  }

  async porSlug(slug: string) {
    return (await this.dados()).produtos.find((p) => p.id === slug);
  }

  async codigo(produtoDbId: number) {
    return (await this.dados()).codigoDe.get(produtoDbId) ?? null;
  }

  async produtoCitado(texto: string) {
    const t = ` ${slugify(texto).replace(/-/g, ' ')} `;
    const lista = [...(await this.dados()).produtos].sort((a, b) => b.name.length - a.name.length);
    return lista.find((p) => t.includes(` ${p.id.replace(/-/g, ' ')} `)) ?? null;
  }
}
