import { createStore } from '../lib/createStore'
import { createChecker } from '../lib/credentials'

/**
 * Login de atendente — PROTÓTIPO. Credenciais genéricas para a banca avaliar o site.
 * Fica só em memória (recarregar a página encerra a sessão).
 * Na fase 2 isto vira POST /api/auth/atendente/login (bcrypt na tabela `atendente` + JWT).
 */
const DEMO = { nomeExibicao: 'Atendente Demo' }
const check = createChecker('ce0cac04ca223d40f50cf1e7853f7345fca7a0476018dc01cadaf09d8d2f729c', '65adb46e0facc1c615233d67f8d2a142181dee09e9d65113a132bb9f57f7e735')

export const STAFF_PATH = import.meta.env.VITE_STAFF_PATH || '/atendente'

const session = createStore<{ nomeExibicao: string } | null>(null)
export const useSession = session.use
export const logout = () => session.set(null)

export async function loginAtendente(email: string, senha: string): Promise<boolean> {
  if (await check(email, senha)) {
    session.set({ nomeExibicao: DEMO.nomeExibicao })
    return true
  }
  return false
}
