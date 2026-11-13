import { BadRequestException, Body, ConflictException, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { Auth, UsuariaGuard, type TokenPayload } from '../auth/guards.js';
import { intId, str, urgenciaRank } from '../domain.js';
import { CatalogoService } from './catalogo.service.js';

@Controller()
export class LojaController {
  constructor(private readonly db: PrismaService, private readonly catalogo: CatalogoService) {}

  @Get('catalogo')
  async getCatalogo() {
    const { categorias, produtos } = await this.catalogo.dados();
    return { categorias, produtos };
  }

  @Get('codigos')
  @UseGuards(UsuariaGuard)
  async codigos() {
    const { produtos, codigoDe } = await this.catalogo.dados();
    const out: Record<string, { significado: string; urgencia: string }> = {};
    for (const p of produtos) {
      const c = codigoDe.get(p.dbId);
      if (c) out[p.id] = { significado: c.significado, urgencia: c.urgencia };
    }
    return out;
  }

  @Post('pedidos/acertar')
  @UseGuards(UsuariaGuard)
  async acertar(@Auth() auth: TokenPayload, @Body() body: { itens?: unknown }) {
    if (!Array.isArray(body?.itens) || body.itens.length === 0 || body.itens.length > 50) throw new BadRequestException('itens inválidos');
    const itens: { dbId: number; nome: string; qtd: number; cod: Awaited<ReturnType<CatalogoService['codigo']>> }[] = [];
    for (const raw of body.itens as { produto?: unknown; qtd?: unknown }[]) {
      const p = await this.catalogo.porSlug(String(raw?.produto ?? ''));
      const qtd = Number(raw?.qtd);
      if (!p || !Number.isInteger(qtd) || qtd < 1 || qtd > 99) throw new BadRequestException('item inválido');
      itens.push({ dbId: p.dbId, nome: p.name, qtd, cod: await this.catalogo.codigo(p.dbId) });
    }
    const top = [...itens].sort((a, b) => urgenciaRank(b.cod?.urgencia) - urgenciaRank(a.cod?.urgencia))[0];
    const urgencia = top.cod?.urgencia ?? 'media';

    const conversa = await this.db.$transaction(async (tx) => {
      const oc = await tx.ocorrencia.create({
        data: {
          usuaria_id: auth.sub, origem: 'pedido_web', urgencia, status: 'aberta',
          relato: `Itens do pedido: ${itens.map((i) => `${i.qtd}× ${i.nome}`).join(', ')}`,
          ocorrencia_item: { create: itens.map((i) => ({ produto_id: i.dbId, quantidade: i.qtd })) },
        },
      });
      const agora = new Date();
      return tx.conversa.create({
        data: {
          usuaria_id: auth.sub, ocorrencia_id: oc.id, produto_id: top.dbId, codigo_disfarce_id: top.cod?.id ?? null,
          origem: 'produto', status: 'aguardando',
          significado_inicial: top.cod?.significado ?? null, urgencia_inicial: top.cod?.urgencia ?? null,
          ultima_mensagem_em: agora,
          mensagem: { create: { autor: 'sistema', conteudo: 'Conversa aberta a partir de um pedido.', enviada_em: agora } },
        },
      });
    });
    return { conversaId: conversa.id };
  }

  private async minhaConversa(id: number, usuariaId: number) {
    const c = await this.db.conversa.findUnique({ where: { id } });
    if (!c || c.usuaria_id !== usuariaId) throw new NotFoundException();
    return c;
  }

  @Get('conversas/:id')
  @UseGuards(UsuariaGuard)
  async conversa(@Auth() auth: TokenPayload, @Param('id') idRaw: string) {
    const c = await this.minhaConversa(intId(idRaw), auth.sub);
    const mensagens = await this.db.mensagem.findMany({ where: { conversa_id: c.id, autor: { not: 'sistema' } }, orderBy: { id: 'asc' } });
    return { status: c.status, mensagens: mensagens.map((m) => ({ id: m.id, autor: m.autor, conteudo: m.conteudo, enviadaEm: m.enviada_em })) };
  }

  @Post('conversas/:id/mensagens')
  @UseGuards(UsuariaGuard)
  async enviar(@Auth() auth: TokenPayload, @Param('id') idRaw: string, @Body() body: { conteudo?: unknown }) {
    const c = await this.minhaConversa(intId(idRaw), auth.sub);
    if (c.status === 'encerrada' || c.status === 'abandonada') throw new ConflictException('Conversa encerrada.');
    const conteudo = str(body?.conteudo, 'mensagem', 2000);
    const citado = await this.catalogo.produtoCitado(conteudo);
    const cod = citado ? await this.catalogo.codigo(citado.dbId) : null;
    const agora = new Date();
    const [m] = await this.db.$transaction([
      this.db.mensagem.create({
        data: {
          conversa_id: c.id, autor: 'usuaria', conteudo, enviada_em: agora,
          produto_id: citado?.dbId ?? null, codigo_disfarce_id: cod?.id ?? null,
          significado_codigo: cod?.significado ?? null, contem_codigo: !!cod,
        },
      }),
      this.db.conversa.update({ where: { id: c.id }, data: { ultima_mensagem_em: agora } }),
    ]);
    return { id: m.id, autor: m.autor, conteudo: m.conteudo, enviadaEm: m.enviada_em };
  }
}

