import { createStore } from '../lib/createStore'

/**
 * Login de atendente — PROTÓTIPO. Credenciais genéricas para a banca avaliar o site.
 * Fica só em memória (recarregar a página encerra a sessão).
 * Na fase 2 isto vira POST /api/auth/atendente/login (bcrypt na tabela `atendente` + JWT).
 */
const DEMO = { email: 'atendente@gmail.com', senha: 'SaveOurSkin123', nomeExibicao: 'Atendente Demo' }

export const STAFF_PATH = import.meta.env.VITE_STAFF_PATH || '/atendente'

const session = createStore<{ nomeExibicao: string } | null>(null)
export const useSession = session.use
export const logout = () => session.set(null)

export async function loginAtendente(email: string, senha: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 450))
  if (email.trim().toLowerCase() === DEMO.email && senha === DEMO.senha) {
    session.set({ nomeExibicao: DEMO.nomeExibicao })
    return true
  }
  return false
}
