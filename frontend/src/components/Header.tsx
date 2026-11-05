import { useState } from 'react'
import { BagIcon, HeartIcon, MenuIcon, SearchIcon, Venus } from './Icons'

const links = ['Início', 'Maquiagem', 'Skincare', 'Acessórios', 'Ofertas']

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <div className="container header-inner">
        <button className="icon-btn d-lg-none" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <MenuIcon />
        </button>
        <a href="/" className="brand" aria-label="Save Our Skin">
          <Venus size={20} />
          <span>Save Our Skin</span>
        </a>
        <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Principal">
          {links.map((l, i) => (
            <a key={l} href="#" className={i === 0 ? 'active' : ''} onClick={(e) => e.preventDefault()}>{l}</a>
          ))}
        </nav>
        <div className="header-tools">
          <label className="search d-none d-md-flex">
            <SearchIcon size={18} />
            <input type="search" placeholder="Buscar produtos" aria-label="Buscar produtos" />
          </label>
          <button className="icon-btn d-md-none" aria-label="Buscar"><SearchIcon /></button>
          <button className="icon-btn" aria-label="Favoritos"><HeartIcon /></button>
          <button className="icon-btn bag" aria-label="Sacola de compras" data-count="0"><BagIcon /></button>
        </div>
      </div>
    </header>
  )
}
