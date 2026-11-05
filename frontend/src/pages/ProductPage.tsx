import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductArt } from '../components/Art'
import ProductCard from '../components/ProductCard'
import { addToCart } from '../data/cart'
import { getCode, SIGNIFICADO_INFO } from '../data/codes'
import { useHints } from '../data/userAuth'
import { brl, byCategory, getCategory, getProduct } from '../data/products'
import { Navigate } from 'react-router-dom'
import './catalog.css'

export default function ProductPage() {
  const { id = '' } = useParams()
  const product = getProduct(id)
  const [added, setAdded] = useState(false)
  const [info, setInfo] = useState(false)
  const hints = useHints()
  if (!product) return <Navigate to="/404" replace />
  const code = hints ? getCode(product.id) : undefined
  const sig = code && SIGNIFICADO_INFO[code.significado]
  const cat = getCategory(product.category)!
  const related = byCategory(product.category).filter((p) => p.id !== product.id).slice(0, 4)
  return (
    <section className="section catalog">
      <div className="container">
        <nav className="crumbs" aria-label="Você está em"><Link to="/">Início</Link> / <Link to={`/categoria/${cat.slug}`}>{cat.name}</Link> / <span>{product.name}</span></nav>
        <div className="row g-5 align-items-start">
          <div className="col-md-6"><div className="pdp-media"><ProductArt kind={product.art} flowers /></div></div>
          <div className="col-md-6">
            <p className="product-tag">{product.tag}</p>
            <div className="pdp-head">
              <h1 className="pdp-title">{product.name}</h1>
              {sig && <button className="info-btn" aria-expanded={info} aria-controls="pdp-info" aria-label="Informações sobre este item" title={sig.hover} onClick={() => setInfo(!info)}>i</button>}
            </div>
            {sig && info && (
              <div id="pdp-info" className="info-box" role="note">
                <strong>{code!.emergencia ? 'Pedido de ajuda imediato' : sig.label}</strong>
                <span className={`urg ${code!.urgencia}`}>urgência {code!.urgencia}</span>
                <p>{sig.detail}</p>
                <p className="small">Ao tocar em “Fale com o vendedor”, a equipe já recebe essa informação.</p>
              </div>
            )}
            <p className="price pdp-price">{brl(product.price)}</p>
            <p className="pdp-desc">{product.description}</p>
            <p className="pdp-meta"><span className="swatch" style={{ background: product.colorHex }} aria-hidden="true" /> Cor {product.colorHex.toUpperCase()} · {product.stock > 0 ? 'Em estoque' : 'Indisponível'}</p>
            <div className="pdp-actions">
              <button className="btn-brand" onClick={() => { addToCart(product.id); setAdded(true) }}>{added ? 'Adicionado ✓' : 'Adicionar à sacola'}</button>
              {added && <Link to="/sacola" className="btn-ghost">Ver sacola</Link>}
            </div>
          </div>
        </div>
        {related.length > 0 && (
          <div className="related">
            <h2>Você também pode gostar</h2>
            <div className="row g-4">{related.map((p) => <div key={p.id} className="col-6 col-lg-3"><ProductCard product={p} /></div>)}</div>
          </div>
        )}
      </div>
    </section>
  )
}
