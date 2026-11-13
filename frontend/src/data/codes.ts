import { createStore } from '../lib/createStore'
import { api } from '../lib/api'
import type { Significado, Urgencia } from './staffStore'

export const SHOW_HINTS = import.meta.env.VITE_SHOW_HINTS !== 'false'

export interface SignInfo { label: string; hover: string; detail: string; staff: string }

export const SIGNIFICADO_INFO: Record<Significado, SignInfo> = {
  violencia_fisica: { label: 'Violência física', hover: 'Agressão física', detail: 'Indica agressões ao corpo: empurrões, tapas, socos ou lesões.', staff: 'Perguntar se há ferimentos e se precisa de atendimento médico.' },
  violencia_psicologica: { label: 'Violência psicológica', hover: 'Manipulação e humilhação', detail: 'Indica humilhações, manipulação, xingamentos ou controle emocional.', staff: 'Acolher sem julgar; evitar perguntas que culpem.' },
  violencia_sexual: { label: 'Violência sexual', hover: 'Abuso sexual', detail: 'Indica toques, relações ou atos sexuais sem consentimento.', staff: 'Acolher com cuidado; orientar sobre atendimento de saúde e delegacia.' },
  violencia_patrimonial: { label: 'Violência patrimonial', hover: 'Controle de bens e dinheiro', detail: 'Indica controle do dinheiro, destruição ou retenção de documentos e bens.', staff: 'Orientar sobre documentos e medidas protetivas.' },
  ameaca: { label: 'Ameaça', hover: 'Ameaça', detail: 'Indica ameaças contra ela, filhos ou familiares.', staff: 'Perguntar se está em local seguro antes de seguir.' },
  cerceamento: { label: 'Cerceamento de liberdade', hover: 'Isolamento e vigilância', detail: 'Indica isolamento, vigilância ou proibição de sair, trabalhar ou falar com pessoas.', staff: 'Confirmar se pode falar agora e se o aparelho é monitorado.' },
  outro: { label: 'Outro / orientação', hover: 'Orientação geral', detail: 'Indica dúvida, pedido de orientação ou situação ainda não classificada.', staff: 'Conversar para entender a situação antes de classificar.' },
}

export interface ProductCode { significado: Significado; urgencia: Urgencia; emergencia?: boolean }

const store = createStore<Record<string, ProductCode>>({})
export const useCodes = store.use
export const clearCodes = () => store.set({})
export async function loadCodes(token: string) {
  const d = await api<Record<string, { significado: Significado; urgencia: Urgencia }>>('/codigos', { token })
  const out: Record<string, ProductCode> = {}
  for (const [slug, c] of Object.entries(d)) out[slug] = { ...c, emergencia: c.urgencia === 'emergencia' }
  store.set(out)
}

export const hoverText = (c: ProductCode | undefined) =>
  !c ? null : c.emergencia ? 'Pedido de ajuda imediato' : SIGNIFICADO_INFO[c.significado].hover
