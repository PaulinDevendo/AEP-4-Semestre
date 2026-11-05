import { HeroArt, Petal } from './Art'
import { brl } from '../data/products'
import { Venus } from './Icons'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6 order-2 order-lg-1 reveal">
            <span className="eyebrow">Coleção exclusiva · Edição limitada</span>
            <h1>Sua beleza merece ser <em>celebrada.</em></h1>
            <p className="lead-text">
              Descubra nossa nova seleção de cores intensas, desenvolvidas para acompanhar você em todos os momentos.
            </p>

            <div className="featured">
              <div>
                <span className="seal">Lançamento especial</span>
                <h2>Batom Rouge Intense</h2>
                <p className="price">{brl(49.9)}</p>
              </div>
              <a href="#favoritos" className="btn-brand">Adquirir agora</a>
            </div>

            <p className="notice">
              <strong>Últimas unidades!</strong> Garanta sua cor favorita. Confirmação de envio em poucos minutos.
            </p>
            <p className="priority"><Venus size={14} /> Atendimento prioritário</p>
          </div>

          <div className="col-lg-6 order-1 order-lg-2">
            <div className="hero-photo">
              <HeroArt />
              <Petal className="float petal-a" />
              <Petal className="float petal-b" />
              <Petal className="float petal-c" />
              <span className="photo-tag">Rouge Intense · 01 Vermelho</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
