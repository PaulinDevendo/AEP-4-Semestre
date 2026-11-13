import { createStore } from '../lib/createStore'
import { api } from '../lib/api'
import { clearCodes, loadCodes, SHOW_HINTS } from './codes'

export interface UserSession { apelido: string; token: string }
const session = createStore<UserSession | null>(null)
export const useUserSession = session.use
export const getUserSession = session.get
export const logoutUsuaria = () => { session.set(null); clearCodes() }

/** As dicas de agressão (botão "i" e hover) só aparecem para usuária logada. */
export const useHints = () => SHOW_HINTS && session.use() !== null

async function abrir(s: UserSession) {
  session.set(s)
  if (SHOW_HINTS) await loadCodes(s.token).catch(() => clearCodes())
}

export async function loginUsuaria(email: string, senha: string) {
  await abrir(await api<UserSession>('/auth/login', { body: { email, senha } }))
}

export async function registrarUsuaria(dados: { apelido: string; email: string; senha: string; pin?: string }) {
  await abrir(await api<UserSession>('/auth/cadastro', { body: dados }))
}
