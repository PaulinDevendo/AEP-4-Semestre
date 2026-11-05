import { useEffect, type RefObject } from 'react'

/**
 * Paralaxe guiado pelo cursor. Escreve --mx/--my (-1..1, suavizados) no palco.
 * O loop de animação só roda enquanto há movimento a interpolar.
 * Desligado em telas sem hover e com prefers-reduced-motion.
 */
export function useParallax(area: RefObject<HTMLElement | null>, stage: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const a = area.current
    const s = stage.current
    if (!a || !s) return
    if (!matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return

    const t = { x: 0, y: 0 }
    const c = { x: 0, y: 0 }
    let raf = 0

    const tick = () => {
      c.x += (t.x - c.x) * 0.085
      c.y += (t.y - c.y) * 0.085
      s.style.setProperty('--mx', c.x.toFixed(4))
      s.style.setProperty('--my', c.y.toFixed(4))
      if (Math.abs(t.x - c.x) > 0.001 || Math.abs(t.y - c.y) > 0.001) raf = requestAnimationFrame(tick)
      else raf = 0
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick) }

    const move = (e: PointerEvent) => {
      const r = a.getBoundingClientRect()
      t.x = Math.max(-1, Math.min(1, (e.clientX / innerWidth - 0.5) * 2))
      t.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2))
      kick()
    }
    const leave = () => { t.x = 0; t.y = 0; kick() }

    a.addEventListener('pointermove', move, { passive: true })
    a.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      a.removeEventListener('pointermove', move)
      a.removeEventListener('pointerleave', leave)
    }
  }, [area, stage])
}
