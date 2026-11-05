import { ProductArt } from './Art'
import { EyeIcon, HeartIcon } from './Icons'
import { brl, type Product } from '../data/products'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <div className="product-media">
        <ProductArt kind={product.art} />
        <button className="fav" aria-label={`Favoritar ${product.name}`}><HeartIcon size={18} /></button>
        <button className="quick" aria-label={`Visualizar ${product.name}`}><EyeIcon size={18} /> Visualizar</button>
      </div>
      <div className="product-info">
        <p className="product-tag">{product.tag}</p>
        <h3>{product.name}</h3>
        <p className="price">{brl(product.price)}</p>
      </div>
    </article>
  )
}
