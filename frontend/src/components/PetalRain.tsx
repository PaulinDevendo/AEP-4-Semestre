import type { CSSProperties } from 'react'
import { Petal } from './Art'

const petals = [
  { l: 8, s: 22, d: 11, o: 0, c: 'wine' }, { l: 22, s: 16, d: 14, o: -5, c: 'rose' },
  { l: 38, s: 26, d: 12, o: -8, c: 'blush' }, { l: 55, s: 18, d: 15, o: -2, c: 'wine' },
  { l: 70, s: 24, d: 13, o: -10, c: 'rose' }, { l: 84, s: 16, d: 16, o: -6, c: 'blush' },
  { l: 93, s: 20, d: 12, o: -3, c: 'wine' }, { l: 46, s: 14, d: 17, o: -12, c: 'rose' },
]

/** Pétalas caindo — só transform/opacity, desligadas com reduced-motion. */
export default function PetalRain({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <div className={`petal-rain ${tone}`} aria-hidden="true">
      {petals.map((p, i) => (
        <Petal
          key={i}
          className={`rain ${p.c}`}
          style={{ left: `${p.l}%`, width: p.s, '--dur': `${p.d}s`, '--delay': `${p.o}s` } as CSSProperties}
        />
      ))}
    </div>
  )
}
