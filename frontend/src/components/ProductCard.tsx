import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductArt } from './Art'
import { EyeIcon, HeartIcon } from './Icons'
import { brl, type Product } from '../data/products'
import { hoverText } from '../data/codes'
import { useHints } from '../data/userAuth'

export default function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false)
  const hints = useHints()
  const hint = hints ? hoverText(product.id) : null
  return (
    <article className="product-card">
      {hint && <span id={`h-${product.id}`} role="tooltip" className="hint">{hint}</span>}
      <div className="product-media">
        <ProductArt kind={product.art} />
        <button className={`fav${liked ? ' liked' : ''}`} aria-pressed={liked} aria-label={`Favoritar ${product.name}`} onClick={() => setLiked(!liked)}><HeartIcon size={18} /></button>
        <Link className="quick" to={`/produto/${product.id}`} aria-label={`Visualizar ${product.name}`}><EyeIcon size={18} /> Visualizar</Link>
      </div>
      <div className="product-info">
        <p className="product-tag">{product.tag}</p>
        <h3><Link to={`/produto/${product.id}`} className="stretched" aria-describedby={hint ? `h-${product.id}` : undefined}>{product.name}</Link></h3>
        <p className="price">{brl(product.price)}</p>
      </div>
    </article>
  )
}
