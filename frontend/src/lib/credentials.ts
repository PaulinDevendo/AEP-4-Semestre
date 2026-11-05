/**
 * Verificação de credenciais do PROTÓTIPO sem deixar e-mail/senha em texto puro no bundle.
 * Não é segurança de verdade (hash no cliente pode ser forçado): a validação real é o bcrypt
 * no NestJS (fase 2). Inclui bloqueio temporário após tentativas erradas.
 */
const sha = async (s: string) =>
  Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('sos:' + s))))
    .map((b) => b.toString(16).padStart(2, '0')).join('')

export function createChecker(emailHash: string, senhaHash: string) {
  let fails = 0
  let lockedUntil = 0
  return async (email: string, senha: string): Promise<boolean> => {
    if (Date.now() < lockedUntil) return false
    await new Promise((r) => setTimeout(r, 450))
    const [e, s] = await Promise.all([sha(email.trim().toLowerCase()), sha(senha)])
    const ok = e === emailHash && s === senhaHash
    if (ok) { fails = 0; return true }
    if (++fails >= 5) { lockedUntil = Date.now() + 30_000; fails = 0 }
    return false
  }
}
