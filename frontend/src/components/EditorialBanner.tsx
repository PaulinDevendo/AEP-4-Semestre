import { Link } from 'react-router-dom'
import PetalRain from './PetalRain'

export default function EditorialBanner() {
  return (
    <section className="editorial">
      <div className="silk silk-1" /><div className="silk silk-2" />
      <PetalRain tone="dark" />
      <div className="container text-center position-relative" data-reveal="up">
        <span className="eyebrow light">Coleção</span>
        <h2>Pequenos detalhes,<br /><em>grandes transformações.</em></h2>
        <Link to="/categoria/batons" className="btn-outline-light-brand">Conheça nossa coleção</Link>
      </div>
    </section>
  )
}
