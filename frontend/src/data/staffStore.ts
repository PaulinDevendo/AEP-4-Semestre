import { createStore } from '../lib/createStore'
import { getCode, SIGNIFICADO_INFO } from './codes'

/* Constantes espelhando os CHECKs do banco (iguais às de packages/shared). */
export const SIGNIFICADOS = ['violencia_fisica', 'violencia_psicologica', 'violencia_sexual', 'violencia_patrimonial', 'ameaca', 'cerceamento', 'outro'] as const
export const URGENCIAS = ['baixa', 'media', 'alta', 'emergencia'] as const
export const STATUS_OCORRENCIA = ['aberta', 'em_atendimento', 'encaminhada', 'encerrada', 'falso_positivo'] as const
export type Significado = (typeof SIGNIFICADOS)[number]
export type Urgencia = (typeof URGENCIAS)[number]
export type StatusOcorrencia = (typeof STATUS_OCORRENCIA)[number]

export interface Mensagem { id: number; autor: 'usuaria' | 'atendente' | 'sistema'; conteudo: string; contemCodigo: boolean; significadoCodigo: Significado | null; enviadaEm: number }
export interface Conversa {
  id: number; apelido: string; produtoId: string | null; origem: 'produto' | 'direta'
  status: 'aguardando' | 'em_andamento' | 'encerrada' | 'abandonada'
  significado: Significado | null; urgencia: Urgencia | null; orientacao: string | null
  atendente: string | null; abertaEm: number; mensagens: Mensagem[]
}
export interface Ocorrencia {
  id: number; apelido: string; origem: 'pedido_web' | 'chat' | 'contato_manual'
  tipo: Significado | null; urgencia: Urgencia; status: StatusOcorrencia
  relato: string; criadaEm: number; instituicao: string | null; conversaId: number | null
}

export const INSTITUICOES = ['Delegacia da Mulher (fictícia)', 'CRAS Centro (fictício)', 'Casa Abrigo Esperança (fictícia)', 'ONG Rede Acolher (fictícia)']

const min = 60_000
const now = Date.now()
let seq = 100

// Dados 100% fictícios. Significados/urgências reais virão da tabela `codigo_disfarce`.
const seed: Conversa[] = [
  { id: 1, apelido: 'Lia', produtoId: 'rosa-antigo', origem: 'produto', status: 'aguardando', significado: 'ameaca', urgencia: 'alta', orientacao: 'Perguntar se está em local seguro antes de seguir.', atendente: null, abertaEm: now - 4 * min,
    mensagens: [{ id: 1, autor: 'sistema', conteudo: 'Conversa aberta a partir de um produto.', contemCodigo: false, significadoCodigo: null, enviadaEm: now - 4 * min }, { id: 2, autor: 'usuaria', conteudo: 'Oi, esse tom está disponível?', contemCodigo: false, significadoCodigo: null, enviadaEm: now - 3 * min }] },
  { id: 2, apelido: 'Marina', produtoId: null, origem: 'direta', status: 'em_andamento', significado: null, urgencia: 'media', orientacao: null, atendente: 'Atendente Demo', abertaEm: now - 22 * min,
    mensagens: [{ id: 3, autor: 'usuaria', conteudo: 'Preciso de ajuda com um pedido.', contemCodigo: false, significadoCodigo: null, enviadaEm: now - 21 * min }, { id: 4, autor: 'atendente', conteudo: 'Claro! Pode me contar melhor?', contemCodigo: false, significadoCodigo: null, enviadaEm: now - 20 * min }, { id: 5, autor: 'usuaria', conteudo: 'Quero o Blush Romantic, mas o de outro dia, sabe?', contemCodigo: true, significadoCodigo: 'violencia_psicologica', enviadaEm: now - 18 * min }] },
  { id: 3, apelido: 'Duda', produtoId: 'nude-seda', origem: 'produto', status: 'encerrada', significado: 'cerceamento', urgencia: 'baixa', orientacao: null, atendente: 'Atendente Demo', abertaEm: now - 190 * min,
    mensagens: [{ id: 6, autor: 'sistema', conteudo: 'Conversa encerrada.', contemCodigo: false, significadoCodigo: null, enviadaEm: now - 150 * min }] },
]
const seedOc: Ocorrencia[] = [
  { id: 1, apelido: 'Marina', origem: 'chat', tipo: null, urgencia: 'media', status: 'em_atendimento', relato: 'Contato iniciado pelo chat; classificação pendente.', criadaEm: now - 20 * min, instituicao: null, conversaId: 2 },
  { id: 2, apelido: 'Duda', origem: 'pedido_web', tipo: 'cerceamento', urgencia: 'baixa', status: 'encerrada', relato: 'Pedido simples, orientada e encerrada.', criadaEm: now - 190 * min, instituicao: null, conversaId: 3 },
]

export const conversas = createStore<Conversa[]>(seed)
export const ocorrencias = createStore<Ocorrencia[]>(seedOc)

const patch = (id: number, fn: (c: Conversa) => Conversa) => conversas.set((l) => l.map((c) => (c.id === id ? fn(c) : c)))
const msg = (autor: Mensagem['autor'], conteudo: string): Mensagem => ({ id: ++seq, autor, conteudo, contemCodigo: false, significadoCodigo: null, enviadaEm: Date.now() })

/** "Fale com o vendedor": copia significado/urgência do código vigente (aqui, ainda não definidos). */
export function abrirConversa(produtoId: string | null, apelido: string): number {
  const id = ++seq
  const code = produtoId ? getCode(produtoId) : undefined
  conversas.set((l) => [{ id, apelido, produtoId, origem: produtoId ? 'produto' : 'direta', status: 'aguardando', significado: code?.significado ?? null, urgencia: code?.urgencia ?? null, orientacao: code ? SIGNIFICADO_INFO[code.significado].staff : null, atendente: null, abertaEm: Date.now(), mensagens: [msg('sistema', 'Conversa aberta.')] }, ...l])
  return id
}
export const enviarMensagem = (id: number, autor: Mensagem['autor'], texto: string) => patch(id, (c) => ({ ...c, mensagens: [...c.mensagens, msg(autor, texto)] }))
export const assumir = (id: number, nome: string) => patch(id, (c) => ({ ...c, status: 'em_andamento', atendente: nome, mensagens: [...c.mensagens, msg('sistema', 'Atendimento iniciado.')] }))
export const encerrar = (id: number) => patch(id, (c) => ({ ...c, status: 'encerrada', mensagens: [...c.mensagens, msg('sistema', 'Conversa encerrada.')] }))
export function criarOcorrencia(c: Conversa) {
  if (ocorrencias.get().some((o) => o.conversaId === c.id)) return
  ocorrencias.set((l) => [{ id: ++seq, apelido: c.apelido, origem: 'chat', tipo: c.significado, urgencia: c.urgencia ?? 'media', status: 'aberta', relato: '', criadaEm: Date.now(), instituicao: null, conversaId: c.id }, ...l])
}
export const atualizarOcorrencia = (id: number, p: Partial<Ocorrencia>) => ocorrencias.set((l) => l.map((o) => (o.id === id ? { ...o, ...p } : o)))
