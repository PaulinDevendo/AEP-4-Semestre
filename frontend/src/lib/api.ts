const BASE = `${(import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')}/api`

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) { super(message); this.status = status }
}

export async function api<T>(path: string, opts: { method?: string; body?: unknown; token?: string | null } = {}): Promise<T> {
  const headers: Record<string, string> = {}
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json'
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`
  let res: Response
  try {
    res = await fetch(BASE + path, {
      method: opts.method ?? (opts.body !== undefined ? 'POST' : 'GET'),
      headers, cache: 'no-store', credentials: 'omit',
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Sem conexão. Tente de novo em instantes.')
  }
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const msg = Array.isArray(data?.message) ? data.message[0] : data?.message
    throw new ApiError(res.status, res.status === 429 ? 'Muitas tentativas. Aguarde um minuto.' : msg || 'Algo deu errado. Tente de novo.')
  }
  return data as T
}
