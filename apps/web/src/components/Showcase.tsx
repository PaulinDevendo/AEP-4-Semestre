import ProductCard from './ProductCard'
import { products } from '../data/products'

export default function Showcase() {
  return (
    <section id="favoritos" className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Seleção da estação</span>
          <h2>Descubra seus favoritos</h2>
          <span className="rule" />
        </div>
        <div className="row g-4">
          {products.map((p) => (
            <div key={p.id} className="col-6 col-lg-3"><ProductCard product={p} /></div>
          ))}
        </div>
      </div>
    </section>
  )
}
