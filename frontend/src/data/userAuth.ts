import { createStore } from '../lib/createStore'
import { SHOW_HINTS } from './codes'

/**
 * Login de usuária — PROTÓTIPO. Conta genérica para a banca avaliar a loja.
 * Só em memória (recarregar encerra a sessão). Na fase 2 vira POST /api/auth/login
 * (bcrypt na tabela `usuaria` + JWT).
 */
const DEMO = { email: 'mariadapenha@gmail.com', senha: 'SOSHELP', apelido: 'Maria' }

const session = createStore<{ apelido: string } | null>(null)
export const useUserSession = session.use
export const logoutUsuaria = () => session.set(null)

/** As dicas de agressão (botão "i" e hover) só aparecem para usuária logada. */
export const useHints = () => SHOW_HINTS && session.use() !== null

export async function loginUsuaria(email: string, senha: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 450))
  if (email.trim().toLowerCase() === DEMO.email && senha === DEMO.senha) {
    session.set({ apelido: DEMO.apelido })
    return true
  }
  return false
}
