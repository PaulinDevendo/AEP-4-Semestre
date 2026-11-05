import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { categories } from '../data/products'
import { useCartCount } from '../data/cart'
import { BagIcon, UserIcon, HeartIcon, MenuIcon, SearchIcon, Venus } from './Icons'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const count = useCartCount()
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="container header-inner">
        <button className="icon-btn d-lg-none" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <MenuIcon />
        </button>
        <Link to="/" className="brand" aria-label="Save Our Skin">
          <Venus size={20} />
          <span>Save Our Skin</span>
        </Link>
        <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Principal">
          {categories.map((c) => (
            <NavLink key={c.slug} to={`/categoria/${c.slug}`} onClick={() => setOpen(false)}>{c.name}</NavLink>
          ))}
        </nav>
        <div className="header-tools">
          <label className="search d-none d-md-flex">
            <SearchIcon size={18} />
            <input type="search" placeholder="Buscar produtos" aria-label="Buscar produtos" />
          </label>
          <button className="icon-btn d-md-none" aria-label="Buscar"><SearchIcon /></button>
          <Link to="/entrar" className="icon-btn" aria-label="Minha conta"><UserIcon /></Link>
          <button className="icon-btn" aria-label="Favoritos"><HeartIcon /></button>
          <button className="icon-btn bag" aria-label="Sacola de compras" data-count={count}><BagIcon /></button>
        </div>
      </div>
    </header>
  )
}
