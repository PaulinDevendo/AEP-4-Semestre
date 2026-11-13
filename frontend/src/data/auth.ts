import { createStore } from '../lib/createStore'
import { api } from '../lib/api'

export const STAFF_PATH = import.meta.env.VITE_STAFF_PATH || '/atendente'

export interface StaffSession { id: number; nomeExibicao: string; token: string; maxConversas: number }
const session = createStore<StaffSession | null>(null)
export const useSession = session.use
export const getSession = session.get
export const logout = () => session.set(null)

export async function loginAtendente(email: string, senha: string) {
  session.set(await api<StaffSession>('/auth/atendente/login', { body: { email, senha } }))
}
