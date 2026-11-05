import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { HeroLayers } from './Art'
import PetalRain from './PetalRain'
import { useParallax } from '../hooks/useParallax'
import { brl } from '../data/products'
import { Venus } from './Icons'

export default function Hero() {
  const area = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  useParallax(area, stage)
  return (
    <section className="hero" ref={area}>
      <PetalRain />
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6 order-2 order-lg-1">
            <span className="eyebrow stagger" style={{ '--i': 0 } as React.CSSProperties}>Coleção exclusiva · Edição limitada</span>
            <h1 className="stagger" style={{ '--i': 1 } as React.CSSProperties}>Sua beleza merece ser <em>celebrada.</em></h1>
            <p className="lead-text stagger" style={{ '--i': 2 } as React.CSSProperties}>
              Descubra nossa nova seleção de cores intensas, desenvolvidas para acompanhar você em todos os momentos.
            </p>

            <div className="featured stagger" style={{ '--i': 3 } as React.CSSProperties}>
              <div>
                <span className="seal">Lançamento especial</span>
                <h2>Batom Rouge Intense</h2>
                <p className="price">{brl(49.9)}</p>
              </div>
              <Link to="/produto/rouge-intense" className="btn-brand">Adquirir agora</Link>
            </div>

            <p className="notice stagger" style={{ '--i': 4 } as React.CSSProperties}>
              <strong>Últimas unidades!</strong> Garanta sua cor favorita. Confirmação de envio em poucos minutos.
            </p>
            <p className="priority stagger" style={{ '--i': 5 } as React.CSSProperties}><Venus size={14} /> Atendimento prioritário</p>
          </div>

          <div className="col-lg-6 order-1 order-lg-2">
            <div className="hero-stage" ref={stage}>
              <div className="hero-photo" role="img" aria-label="Batom vermelho sobre seda rosé, entre rosas e pétalas">
                <HeroLayers />
                <span className="glare" aria-hidden="true" />
                <span className="photo-tag">Rouge Intense · 01 Vermelho</span>
              </div>
              <span className="chip chip-a" aria-hidden="true">Edição limitada</span>
              <span className="chip chip-b" aria-hidden="true">Cor 01 · Rouge</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
