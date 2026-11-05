import { useId } from 'react'
import type { ArtKind } from '../data/products'

/* Ilustrações em SVG que ocupam o lugar das fotografias editoriais.
   Troque por fotos reais em /public/images quando houver. */

export function Petal({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 40 52" aria-hidden>
      <path d="M20 2C32 12 38 28 20 50 2 28 8 12 20 2Z" fill="currentColor" />
      <path d="M20 8v38" stroke="#fff" strokeOpacity=".25" strokeWidth=".8" />
    </svg>
  )
}

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-silk`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#F8EDEF" /><stop offset=".55" stopColor="#EBCBD3" /><stop offset="1" stopColor="#D9A5B3" />
      </linearGradient>
      <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#C9A27A" /><stop offset=".5" stopColor="#F1DCBF" /><stop offset="1" stopColor="#B88B63" />
      </linearGradient>
      <linearGradient id={`${id}-red`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#6E1A2E" /><stop offset=".45" stopColor="#B3263F" /><stop offset="1" stopColor="#7A1B30" />
      </linearGradient>
      <linearGradient id={`${id}-black`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#1F1418" /><stop offset=".5" stopColor="#4A3239" /><stop offset="1" stopColor="#1F1418" />
      </linearGradient>
      <radialGradient id={`${id}-glow`} cx=".5" cy=".45" r=".6">
        <stop offset="0" stopColor="#fff" stopOpacity=".85" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

function SilkBackdrop({ id }: { id: string }) {
  return (
    <>
      <rect width="400" height="500" fill={`url(#${id}-silk)`} />
      <path d="M-20 330C80 270 160 380 260 320s140-30 180-70V520H-20Z" fill="#fff" opacity=".28" />
      <path d="M-20 380C90 330 170 430 270 375s130-20 170-50V520H-20Z" fill="#B76B7D" opacity=".22" />
      <path d="M-20 440C100 400 180 480 280 430s120-10 160-30V520H-20Z" fill="#8C263D" opacity=".16" />
      <ellipse cx="200" cy="220" rx="190" ry="210" fill={`url(#${id}-glow)`} />
    </>
  )
}

function Rose({ x, y, s = 1, fill = '#B3263F' }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity=".95">
      <circle r="26" fill={fill} opacity=".9" />
      <path d="M0-20c14 2 22 14 14 24S-4 14-14 6-12-18 0-20Z" fill="#fff" opacity=".12" />
      <path d="M-4-10c10-3 16 4 12 12S-8 8-12 0s0-8 8-10Z" fill="#000" opacity=".14" />
      <circle r="8" fill="#000" opacity=".16" />
    </g>
  )
}

function Rouge({ id }: { id: string }) {
  return (
    <g>
      <g transform="translate(200 250) rotate(-8)">
        <path d="M-20-140 20-165 20-90-20-90Z" fill={`url(#${id}-red)`} />
        <path d="M-20-140 20-165 20-158-20-132Z" fill="#fff" opacity=".28" />
        <rect x="-28" y="-92" width="56" height="30" rx="3" fill={`url(#${id}-gold)`} />
        <rect x="-32" y="-64" width="64" height="150" rx="6" fill={`url(#${id}-black)`} />
        <rect x="-32" y="-64" width="64" height="5" fill={`url(#${id}-gold)`} />
        <rect x="-32" y="80" width="64" height="6" fill={`url(#${id}-gold)`} />
        <rect x="-24" y="-52" width="5" height="124" rx="2.5" fill="#fff" opacity=".18" />
        <text x="0" y="14" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="13" letterSpacing="3" fill="#F1DCBF" transform="rotate(-90 0 14)">ROUGE</text>
      </g>
    </g>
  )
}

function Essence({ id }: { id: string }) {
  return (
    <g>
      <rect x="160" y="130" width="80" height="34" rx="4" fill={`url(#${id}-gold)`} />
      <rect x="188" y="164" width="24" height="26" fill="#EBCBD3" opacity=".9" />
      <rect x="140" y="190" width="120" height="190" rx="22" fill="#F4C9D2" opacity=".8" />
      <rect x="140" y="250" width="120" height="130" rx="22" fill="#D9899C" opacity=".75" />
      <rect x="150" y="200" width="10" height="165" rx="5" fill="#fff" opacity=".45" />
      <rect x="168" y="268" width="64" height="62" rx="3" fill="#FFF9F5" opacity=".92" />
      <text x="200" y="296" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="11" letterSpacing="1" fill="#8C263D">ESSENCE</text>
      <text x="200" y="314" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="6" letterSpacing="1.5" fill="#B76B7D">ROSÉ · 30 ML</text>
    </g>
  )
}

function Blush({ id }: { id: string }) {
  return (
    <g>
      <ellipse cx="200" cy="300" rx="125" ry="40" fill="#5B3A44" opacity=".25" />
      <circle cx="200" cy="270" r="118" fill={`url(#${id}-gold)`} />
      <circle cx="200" cy="270" r="104" fill="#FFF9F5" />
      <circle cx="200" cy="270" r="88" fill="#C7788A" />
      
      <path d="M130 240c30-30 90-40 125-10" stroke="#fff" strokeOpacity=".4" strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="200" cy="270" r="88" fill="none" stroke="#B76B7D" strokeWidth="1.5" strokeDasharray="2 5" opacity=".7" />
    </g>
  )
}

function Velvet({ id }: { id: string }) {
  return (
    <g>
      <rect x="190" y="110" width="20" height="26" rx="3" fill={`url(#${id}-gold)`} />
      <rect x="176" y="96" width="62" height="14" rx="7" fill={`url(#${id}-gold)`} />
      <rect x="196" y="136" width="8" height="30" fill="#E7C9A8" />
      <rect x="148" y="166" width="104" height="220" rx="18" fill="#E8B9A4" />
      <rect x="148" y="166" width="104" height="220" rx="18" fill="#fff" opacity=".12" />
      <rect x="158" y="176" width="9" height="200" rx="4.5" fill="#fff" opacity=".45" />
      <rect x="170" y="240" width="62" height="70" rx="3" fill="#FFF9F5" opacity=".92" />
      <text x="201" y="270" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="12" letterSpacing="1" fill="#8C263D">VELVET</text>
      <text x="201" y="288" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="7" letterSpacing="3" fill="#B76B7D">SKIN</text>
    </g>
  )
}

export function ProductArt({ kind, flowers = false }: { kind: ArtKind; flowers?: boolean }) {
  const id = useId().replace(/:/g, '')
  const Item = { rouge: Rouge, essence: Essence, blush: Blush, velvet: Velvet }[kind]
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Ilustração do produto" className="art">
      <Defs id={id} />
      <SilkBackdrop id={id} />
      {flowers && (
        <>
          <Rose x={78} y={400} s={1.2} />
          <Rose x={332} y={430} s={1.5} fill="#8C263D" />
          <Rose x={350} y={350} s={.7} fill="#B76B7D" />
        </>
      )}
      <ellipse cx="200" cy="400" rx="95" ry="11" fill="#8C263D" opacity=".16" />
      <Item id={id} />
    </svg>
  )
}

/** Cena do hero em camadas independentes (cada uma com profundidade própria no paralaxe). */
export function HeroLayers() {
  const id = 'hero'
  const layer = (depth: number, scale: number) =>
    ({ '--depth': depth, '--s': scale } as React.CSSProperties)
  const box = { viewBox: '0 0 400 500', preserveAspectRatio: 'xMidYMid slice' as const, className: 'layer', 'aria-hidden': true }
  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
        <Defs id={id} />
      </svg>
      <svg {...box} style={layer(6, 1.1)}><SilkBackdrop id={id} /></svg>
      <svg {...box} style={layer(16, 1.12)}>
        <Rose x={52} y={300} s={.9} fill="#B76B7D" />
        <Rose x={352} y={170} s={.7} fill="#8C263D" />
      </svg>
      <svg {...box} style={layer(32, 1.14)}>
        <ellipse cx="205" cy="412" rx="95" ry="11" fill="#8C263D" opacity=".18" />
        <g className="bob"><Rouge id={id} /></g>
      </svg>
      <svg {...box} style={layer(54, 1.22)}>
        <Rose x={70} y={420} s={1.7} fill="#8C263D" />
        <Rose x={330} y={445} s={1.9} />
        <Rose x={365} y={350} s={.8} fill="#B76B7D" />
      </svg>
      <svg {...box} style={layer(78, 1.28)}>
        <g fill="#B3263F" opacity=".85">
          <path transform="translate(120 130) rotate(30) scale(.5)" d="M20 2C32 12 38 28 20 50 2 28 8 12 20 2Z" />
          <path transform="translate(300 90) rotate(-25) scale(.4)" d="M20 2C32 12 38 28 20 50 2 28 8 12 20 2Z" />
          <path transform="translate(330 220) rotate(50) scale(.45)" d="M20 2C32 12 38 28 20 50 2 28 8 12 20 2Z" />
          <path transform="translate(60 210) rotate(-40) scale(.35)" d="M20 2C32 12 38 28 20 50 2 28 8 12 20 2Z" />
        </g>
      </svg>
    </>
  )
}

export function HeroArt() {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Batom vermelho sobre seda rosé com pétalas de rosa" className="art">
      <Defs id={id} />
      <SilkBackdrop id={id} />
      <Rose x={70} y={420} s={1.7} fill="#8C263D" />
      <Rose x={330} y={445} s={1.9} />
      <Rose x={365} y={350} s={.8} fill="#B76B7D" />
      <ellipse cx="205" cy="412" rx="95" ry="11" fill="#8C263D" opacity=".18" />
      <g className="bob"><Rouge id={id} /></g>
      <g fill="#B3263F" opacity=".85">
        <path transform="translate(120 130) rotate(30) scale(.5)" d="M20 2C32 12 38 28 20 50 2 28 8 12 20 2Z" />
        <path transform="translate(300 90) rotate(-25) scale(.4)" d="M20 2C32 12 38 28 20 50 2 28 8 12 20 2Z" />
        <path transform="translate(330 220) rotate(50) scale(.45)" d="M20 2C32 12 38 28 20 50 2 28 8 12 20 2Z" />
      </g>
    </svg>
  )
}
