import { Petal } from './Art'

export default function EditorialBanner() {
  return (
    <section className="editorial">
      <div className="silk silk-1" /><div className="silk silk-2" />
      <Petal className="float petal-d" /><Petal className="float petal-e" /><Petal className="float petal-f" />
      <div className="container text-center position-relative">
        <span className="eyebrow light">Coleção</span>
        <h2>Pequenos detalhes,<br /><em>grandes transformações.</em></h2>
        <a href="#favoritos" className="btn-outline-light-brand">Conheça nossa coleção</a>
      </div>
    </section>
  )
}
