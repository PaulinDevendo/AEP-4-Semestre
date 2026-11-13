import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useCatalog } from '../data/products'
import { Navigate } from 'react-router-dom'
import { Loading } from '../components/Loading'
import './catalog.css'

export default function Category() {
  const { slug = '' } = useParams()
  const { status, categories, getCategory, byCategory } = useCatalog()
  const cat = getCategory(slug)
  if (status !== 'ready') return <Loading failed={status === 'error'} />
  if (!cat) return <Navigate to="/404" replace />
  const list = byCategory(slug)
  return (
    <section className="section catalog">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Catálogo</span>
          <h1>{cat.name}</h1>
          <p className="muted">{cat.description}</p>
          <span className="rule" />
        </div>
        <div className="row g-4">
          {list.map((p) => <div key={p.id} className="col-6 col-lg-3"><ProductCard product={p} /></div>)}
        </div>
        <nav className="more-cats" aria-label="Outras categorias">
          {categories.filter((c) => c.slug !== slug).map((c) => <Link key={c.slug} to={`/categoria/${c.slug}`}>{c.name}</Link>)}
        </nav>
      </div>
    </section>
  )
}
