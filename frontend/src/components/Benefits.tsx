import { BloomIcon, BoxIcon, TruckIcon } from './Icons'

const items = [
  { icon: <BoxIcon size={30} />, title: 'Embalagem discreta', text: 'Seu pedido chega com cuidado e sem identificação externa.' },
  { icon: <TruckIcon size={30} />, title: 'Entrega para todo o Brasil', text: 'Enviamos para todas as regiões, com acompanhamento.' },
  { icon: <BloomIcon size={30} />, title: 'Feito para você', text: 'Fórmulas pensadas para valorizar cada tipo de pele.' },
]

export default function Benefits() {
  return (
    <section className="benefits">
      <div className="container">
        <div className="row g-4">
          {items.map((i, n) => (
            <div key={i.title} className="col-md-4" data-reveal="up" style={{ '--d': `${n * 130}ms` } as React.CSSProperties}>
              <div className="benefit">
                <span className="benefit-icon">{i.icon}</span>
                <h3>{i.title}</h3>
                <p>{i.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
