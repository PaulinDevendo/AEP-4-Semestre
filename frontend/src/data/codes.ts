import type { Significado, Urgencia } from './staffStore'

/**
 * Código de cada produto (espelha `codigo_disfarce`). Dados de protótipo, editáveis:
 * na API vêm da tabela. Desligue com VITE_SHOW_HINTS=false (esconde dicas na loja pública).
 */
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

export const PRODUCT_CODES: Record<string, ProductCode> = {
  'rouge-intense': { significado: 'ameaca', urgencia: 'alta' },
  'rosa-antigo': { significado: 'violencia_fisica', urgencia: 'alta' },
  'nude-seda': { significado: 'cerceamento', urgencia: 'media' },
  'bordo-noturno': { significado: 'violencia_sexual', urgencia: 'alta' },
  'esmalte-vermelho-vivo': { significado: 'outro', urgencia: 'emergencia', emergencia: true },
  'esmalte-rosa-chiclete': { significado: 'violencia_psicologica', urgencia: 'media' },
  'esmalte-nude-po': { significado: 'violencia_patrimonial', urgencia: 'media' },
  'base-fortalecedora': { significado: 'outro', urgencia: 'baixa' },
  'velvet-skin': { significado: 'violencia_sexual', urgencia: 'alta' },
  'blush-romantic': { significado: 'violencia_psicologica', urgencia: 'media' },
  'po-translucido': { significado: 'outro', urgencia: 'baixa' },
  'glow-iluminador': { significado: 'cerceamento', urgencia: 'media' },
  'essence-rose': { significado: 'violencia_psicologica', urgencia: 'media' },
  'creme-hidratante': { significado: 'violencia_fisica', urgencia: 'alta' },
  'agua-micelar': { significado: 'outro', urgencia: 'baixa' },
  'protetor-solar': { significado: 'ameaca', urgencia: 'media' },
  'kit-pinceis': { significado: 'cerceamento', urgencia: 'media' },
  'esponja-rosa': { significado: 'outro', urgencia: 'baixa' },
  'necessaire-seda': { significado: 'violencia_patrimonial', urgencia: 'media' },
  'espelho-bolso': { significado: 'violencia_psicologica', urgencia: 'baixa' },
}

export const getCode = (productId: string) => PRODUCT_CODES[productId]
export const hoverText = (productId: string) => {
  const c = PRODUCT_CODES[productId]
  if (!c) return null
  return c.emergencia ? 'Pedido de ajuda imediato' : SIGNIFICADO_INFO[c.significado].hover
}
