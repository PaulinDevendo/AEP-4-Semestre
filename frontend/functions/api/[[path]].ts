interface Env { API_ORIGIN?: string }

export const onRequest = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
  if (!env.API_ORIGIN) {
    return new Response(JSON.stringify({ message: 'API_ORIGIN não configurada no Cloudflare Pages.' }), {
      status: 502, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    })
  }
  const url = new URL(request.url)
  const target = new URL(url.pathname + url.search, env.API_ORIGIN)
  const req = new Request(target, request)
  req.headers.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP') ?? '')
  req.headers.delete('Cookie')
  return fetch(req)
}
