import { Body, ConflictException, Controller, Get, HttpCode, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma.service.js';
import { AtendenteGuard, Auth, type TokenPayload } from '../auth/guards.js';
import { intId, oneOf, SIGNIFICADOS, STATUS_OCORRENCIA, str, URGENCIAS } from '../domain.js';

interface PreviaRow {
  conversa_id: number; status: string; origem: string; aberta_em: Date; assumida_em: Date | null
  ultima_mensagem_em: Date | null; usuaria_id: number; apelido: string | null; produto_escolhido: string | null
  tipo_agressao: string | null; urgencia_inicial: string | null; orientacao_equipe: string | null
  atendente_id: number | null; atendente: string | null; ocorrencia_id: number | null
}

const msgDTO = (m: { id: number; autor: string; conteudo: string; contem_codigo: boolean | null; significado_codigo: string | null; enviada_em: Date | null }) => ({
  id: m.id, autor: m.autor, conteudo: m.conteudo, contemCodigo: !!m.contem_codigo, significadoCodigo: m.significado_codigo, enviadaEm: m.enviada_em,
});

@Controller('painel')
@UseGuards(AtendenteGuard)
export class PainelController {
  constructor(private readonly db: PrismaService) {}

  @Post('ping')
  @HttpCode(200)
  async ping(@Auth() auth: TokenPayload, @Body() body: { disponivel?: unknown }) {
    const data: Prisma.atendenteUpdateInput = { ultimo_ping: new Date() };
    if (typeof body?.disponivel === 'boolean') data.disponivel = body.disponivel;
    const a = await this.db.atendente.update({ where: { id: auth.sub }, data });
    return { disponivel: !!a.disponivel, maxConversas: a.max_conversas_simultaneas ?? 3 };
  }

  @Get('conversas')
  async conversas() {
    const rows = await this.db.$queryRaw<PreviaRow[]>`
      SELECT v.*, c.atendente_id, c.ocorrencia_id, a.nome_exibicao AS atendente
      FROM vw_previa_atendimento v
      JOIN conversa c ON c.id = v.conversa_id
      LEFT JOIN atendente a ON a.id = c.atendente_id
      ORDER BY CASE v.status WHEN 'aguardando' THEN 0 WHEN 'em_andamento' THEN 1 ELSE 2 END,
               CASE v.urgencia_inicial WHEN 'emergencia' THEN 0 WHEN 'alta' THEN 1 WHEN 'media' THEN 2 ELSE 3 END,
               v.aberta_em DESC
      LIMIT 200`;
    return rows.map((r) => ({
      id: r.conversa_id, status: r.status, origem: r.origem, abertaEm: r.aberta_em, ultimaMensagemEm: r.ultima_mensagem_em,
      apelido: r.apelido ?? 'Cliente', produto: r.produto_escolhido, significado: r.tipo_agressao, urgencia: r.urgencia_inicial,
      orientacao: r.orientacao_equipe, atendenteId: r.atendente_id, atendente: r.atendente, ocorrenciaId: r.ocorrencia_id,
    }));
  }

  @Get('conversas/:id/mensagens')
  async mensagens(@Param('id') idRaw: string) {
    const id = intId(idRaw);
    const ms = await this.db.mensagem.findMany({ where: { conversa_id: id }, orderBy: { id: 'asc' } });
    await this.db.mensagem.updateMany({ where: { conversa_id: id, autor: 'usuaria', lida: false }, data: { lida: true } });
    return ms.map(msgDTO);
  }

  @Post('conversas/:id/assumir')
  @HttpCode(200)
  async assumir(@Auth() auth: TokenPayload, @Param('id') idRaw: string) {
    const id = intId(idRaw);
    await this.db.$transaction(async (tx) => {
      const a = await tx.atendente.findUniqueOrThrow({ where: { id: auth.sub } });
      if (!a.disponivel) throw new ConflictException('Fique disponível para assumir.');
      const ativas = await tx.conversa.count({ where: { atendente_id: a.id, status: 'em_andamento' } });
      if (ativas >= (a.max_conversas_simultaneas ?? 3)) throw new ConflictException(`Limite de ${a.max_conversas_simultaneas ?? 3} conversas.`);
      const agora = new Date();
      const r = await tx.conversa.updateMany({
        where: { id, atendente_id: null, status: 'aguardando' },
        data: { atendente_id: a.id, status: 'em_andamento', assumida_em: agora },
      });
      if (r.count === 0) throw new ConflictException('Conversa já assumida ou encerrada.');
      await tx.conversa_atendente.create({ data: { conversa_id: id, atendente_id: a.id, assumida_em: agora } });
      await tx.mensagem.create({ data: { conversa_id: id, autor: 'sistema', conteudo: 'Atendimento iniciado.', enviada_em: agora } });
      const oc = await tx.conversa.findUnique({ where: { id }, select: { ocorrencia_id: true } });
      if (oc?.ocorrencia_id) await tx.ocorrencia.updateMany({ where: { id: oc.ocorrencia_id, status: 'aberta' }, data: { status: 'em_atendimento' } });
    });
    return { ok: true };
  }

  private async minha(id: number, atendenteId: number) {
    const c = await this.db.conversa.findUnique({ where: { id } });
    if (!c) throw new NotFoundException();
    if (c.atendente_id !== atendenteId) throw new ConflictException('Esta conversa está com outra pessoa da equipe.');
    return c;
  }

  @Post('conversas/:id/encerrar')
  @HttpCode(200)
  async encerrar(@Auth() auth: TokenPayload, @Param('id') idRaw: string) {
    const c = await this.minha(intId(idRaw), auth.sub);
    if (c.status !== 'em_andamento') throw new ConflictException('A conversa não está em andamento.');
    const agora = new Date();
    await this.db.$transaction([
      this.db.conversa.update({ where: { id: c.id }, data: { status: 'encerrada', fechada_em: agora } }),
      this.db.conversa_atendente.updateMany({ where: { conversa_id: c.id, liberada_em: null }, data: { liberada_em: agora, motivo_saida: 'encerramento' } }),
      this.db.mensagem.create({ data: { conversa_id: c.id, autor: 'sistema', conteudo: 'Conversa encerrada.', enviada_em: agora } }),
    ]);
    return { ok: true };
  }

  @Post('conversas/:id/mensagens')
  async responder(@Auth() auth: TokenPayload, @Param('id') idRaw: string, @Body() body: { conteudo?: unknown }) {
    const c = await this.minha(intId(idRaw), auth.sub);
    if (c.status !== 'em_andamento') throw new ConflictException('A conversa não está em andamento.');
    const agora = new Date();
    const [m] = await this.db.$transaction([
      this.db.mensagem.create({ data: { conversa_id: c.id, autor: 'atendente', conteudo: str(body?.conteudo, 'mensagem', 2000), enviada_em: agora } }),
      this.db.conversa.update({ where: { id: c.id }, data: { ultima_mensagem_em: agora } }),
    ]);
    return msgDTO(m);
  }

  @Post('conversas/:id/ocorrencia')
  @HttpCode(200)
  async criarOcorrencia(@Param('id') idRaw: string) {
    const id = intId(idRaw);
    return this.db.$transaction(async (tx) => {
      const c = await tx.conversa.findUnique({ where: { id } });
      if (!c) throw new NotFoundException();
      if (c.ocorrencia_id) return { ocorrenciaId: c.ocorrencia_id, criada: false };
      const oc = await tx.ocorrencia.create({
        data: {
          usuaria_id: c.usuaria_id, origem: 'chat', tipo: c.significado_inicial,
          urgencia: c.urgencia_inicial ?? 'media', status: c.status === 'em_andamento' ? 'em_atendimento' : 'aberta',
        },
      });
      await tx.conversa.update({ where: { id }, data: { ocorrencia_id: oc.id } });
      return { ocorrenciaId: oc.id, criada: true };
    });
  }

  @Get('instituicoes')
  async instituicoes() {
    const l = await this.db.instituicao_apoio.findMany({ where: { ativo: true }, orderBy: { id: 'asc' } });
    return l.map((i) => ({ id: i.id, nome: i.nome, tipo: i.tipo, telefone: i.telefone, atende24h: !!i.atende_24h }));
  }

  @Get('ocorrencias')
  async ocorrencias() {
    const l = await this.db.ocorrencia.findMany({
      orderBy: { id: 'desc' }, take: 200,
      include: {
        usuaria: { select: { apelido: true } },
        conversa: { select: { id: true }, take: 1 },
        encaminhamento: { select: { instituicao_id: true }, orderBy: { id: 'desc' } },
      },
    });
    return l.map((o) => ({
      id: o.id, apelido: o.usuaria?.apelido ?? 'Sem cadastro', origem: o.origem, tipo: o.tipo, urgencia: o.urgencia ?? 'media',
      status: o.status ?? 'aberta', relato: o.relato ?? '', criadaEm: o.criada_em, conversaId: o.conversa[0]?.id ?? null,
      instituicoes: o.encaminhamento.map((e) => e.instituicao_id),
    }));
  }

  @Patch('ocorrencias/:id')
  async atualizar(@Param('id') idRaw: string, @Body() body: Record<string, unknown>) {
    const id = intId(idRaw);
    const data: Prisma.ocorrenciaUpdateInput = {};
    if ('tipo' in body) data.tipo = body.tipo === null || body.tipo === '' ? null : oneOf(body.tipo, SIGNIFICADOS, 'tipo');
    if ('urgencia' in body) data.urgencia = oneOf(body.urgencia, URGENCIAS, 'urgencia');
    if ('status' in body) {
      const s = oneOf(body.status, STATUS_OCORRENCIA, 'status');
      data.status = s;
      data.encerrada_em = s === 'encerrada' || s === 'falso_positivo' ? new Date() : null;
    }
    if ('relato' in body) data.relato = str(body.relato, 'relato', 5000, 0);
    try {
      await this.db.ocorrencia.update({ where: { id }, data });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') throw new NotFoundException();
      throw e;
    }
    return { ok: true };
  }

  @Post('ocorrencias/:id/encaminhar')
  @HttpCode(200)
  async encaminhar(@Auth() auth: TokenPayload, @Param('id') idRaw: string, @Body() body: { instituicaoId?: unknown; observacao?: unknown }) {
    const id = intId(idRaw);
    const instituicaoId = intId(body?.instituicaoId, 'instituição');
    const observacao = body?.observacao ? str(body.observacao, 'observação', 2000) : null;
    await this.db.$transaction(async (tx) => {
      const oc = await tx.ocorrencia.findUnique({ where: { id }, select: { id: true } });
      const inst = await tx.instituicao_apoio.findUnique({ where: { id: instituicaoId }, select: { id: true } });
      if (!oc || !inst) throw new NotFoundException();
      const ja = await tx.encaminhamento.findFirst({ where: { ocorrencia_id: id, instituicao_id: instituicaoId } });
      if (!ja) await tx.encaminhamento.create({ data: { ocorrencia_id: id, instituicao_id: instituicaoId, atendente_id: auth.sub, observacao } });
      await tx.ocorrencia.update({ where: { id }, data: { status: 'encaminhada', encerrada_em: null } });
    });
    return { ok: true };
  }
}
