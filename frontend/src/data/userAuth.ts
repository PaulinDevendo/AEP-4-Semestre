import { createStore } from '../lib/createStore'
import { createChecker } from '../lib/credentials'
import { SHOW_HINTS } from './codes'

/**
 * Login de usuária — PROTÓTIPO. Conta genérica para a banca avaliar a loja.
 * Só em memória (recarregar encerra a sessão). Na fase 2 vira POST /api/auth/login
 * (bcrypt na tabela `usuaria` + JWT).
 */
const DEMO = { apelido: 'Maria' }
const check = createChecker('e6f9a951f4b7d12bf92ba4ad67252bc41775ae6f8db164f1d155a86f7cc2b7f5', '0096540f715bfbde2ccbe0a0ce2414b96288742a41f00846e95b53599f8455fb')

const session = createStore<{ apelido: string } | null>(null)
export const useUserSession = session.use
export const logoutUsuaria = () => session.set(null)

/** As dicas de agressão (botão "i" e hover) só aparecem para usuária logada. */
export const useHints = () => SHOW_HINTS && session.use() !== null

export async function loginUsuaria(email: string, senha: string): Promise<boolean> {
  if (await check(email, senha)) {
    session.set({ apelido: DEMO.apelido })
    return true
  }
  return false
}

/** Cadastro FALSO (protótipo): não grava nada, só abre a sessão em memória. Fase 2: POST /api/auth/register. */
export const registrarUsuaria = (apelido: string) => session.set({ apelido: apelido.trim() || 'Cliente' })
