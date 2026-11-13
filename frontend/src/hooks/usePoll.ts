import { useCallback, useEffect, useRef, useState } from 'react'

export function usePoll<T>(fn: () => Promise<T>, ms: number, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fnRef = useRef(fn)
  fnRef.current = fn
  const seq = useRef(0)

  const reload = useCallback(async () => {
    const my = ++seq.current
    try {
      const d = await fnRef.current()
      if (my === seq.current) { setData(d); setError(null) }
    } catch (e) {
      if (my === seq.current) setError(e instanceof Error ? e.message : 'Erro')
    }
  }, [])

  useEffect(() => {
    setData(null)
    void reload()
    const t = setInterval(() => { if (!document.hidden) void reload() }, ms)
    return () => { clearInterval(t); seq.current++ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ms, reload, ...deps])

  return { data, error, reload }
}
