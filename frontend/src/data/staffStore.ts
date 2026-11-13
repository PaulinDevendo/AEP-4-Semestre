import { api, ApiError } from '../lib/api'
import { getSession, logout } from './auth'

/* Constantes espelhando os CHECKs do banco (iguais às de packages/shared). */
export const SIGNIFICADOS = ['violencia_fisica', 'violencia_psicologica', 'violencia_sexual', 'violencia_patrimonial', 'ameaca', 'cerceamento', 'outro'] as const
export const URGENCIAS = ['baixa', 'media', 'alta', 'emergencia'] as const
export const STATUS_OCORRENCIA = ['aberta', 'em_atendimento', 'encaminhada', 'encerrada', 'falso_positivo'] as const
export type Significado = (typeof SIGNIFICADOS)[number]
export type Urgencia = (typeof URGENCIAS)[number]
export type StatusOcorrencia = (typeof STATUS_OCORRENCIA)[number]

export interface Mensagem { id: number; autor: 'usuaria' | 'atendente' | 'sistema'; conteudo: string; contemCodigo: boolean; significadoCodigo: Significado | null; enviadaEm: string }
export interface Conversa {
  id: number; apelido: string; produto: string | null; origem: 'produto' | 'direta'
  status: 'aguardando' | 'em_andamento' | 'encerrada' | 'abandonada'
  significado: Significado | null; urgencia: Urgencia | null; orientacao: string | null
  atendenteId: number | null; atendente: string | null; ocorrenciaId: number | null; abertaEm: string
}
export interface Ocorrencia {
  id: number; apelido: string; origem: 'pedido_web' | 'chat' | 'contato_manual'
  tipo: Significado | null; urgencia: Urgencia; status: StatusOcorrencia
  relato: string; criadaEm: string; conversaId: number | null; instituicoes: number[]
}
export interface Instituicao { id: number; nome: string; tipo: string | null; telefone: string | null; atende24h: boolean }

async function staff<T>(path: string, opts: { method?: string; body?: unknown } = {}): Promise<T> {
  try {
    return await api<T>(`/painel${path}`, { ...opts, token: getSession()?.token })
  } catch (e) {
    if (e instanceof ApiError && e.status === 404 && path === '/conversas') logout()
    throw e
  }
}

export const listarConversas = () => staff<Conversa[]>('/conversas')
export const listarMensagens = (id: number) => staff<Mensagem[]>(`/conversas/${id}/mensagens`)
export const assumir = (id: number) => staff(`/conversas/${id}/assumir`, { method: 'POST' })
export const encerrar = (id: number) => staff(`/conversas/${id}/encerrar`, { method: 'POST' })
export const enviarMensagem = (id: number, conteudo: string) => staff<Mensagem>(`/conversas/${id}/mensagens`, { body: { conteudo } })
export const criarOcorrencia = (id: number) => staff<{ ocorrenciaId: number; criada: boolean }>(`/conversas/${id}/ocorrencia`, { method: 'POST' })
export const ping = (disponivel?: boolean) => staff<{ disponivel: boolean; maxConversas: number }>('/ping', { body: { disponivel } })
export const listarOcorrencias = () => staff<Ocorrencia[]>('/ocorrencias')
export const listarInstituicoes = () => staff<Instituicao[]>('/instituicoes')
export const atualizarOcorrencia = (id: number, p: Partial<Pick<Ocorrencia, 'tipo' | 'urgencia' | 'status'>>) =>
  staff(`/ocorrencias/${id}`, { method: 'PATCH', body: p })
export const encaminhar = (id: number, instituicaoId: number) => staff(`/ocorrencias/${id}/encaminhar`, { body: { instituicaoId } })
