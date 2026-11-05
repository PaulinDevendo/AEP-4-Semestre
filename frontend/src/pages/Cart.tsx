import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ChatDrawer from '../components/ChatDrawer'
import { clearCart, order, setQty, useCart } from '../data/cart'
import { brl, getProduct } from '../data/products'
import { abrirPedido } from '../data/staffStore'
import { useUserSession } from '../data/userAuth'
import './cart.css'

export default function Cart() {
  const cart = useCart()
  const done = order.use()
  const user = useUserSession()
  const nav = useNavigate()
  const [chatOpen, setChatOpen] = useState(false)
  const items = Object.entries(cart).map(([id, qty]) => ({ id, qty, p: getProduct(id)! })).filter((i) => i.p)
  const total = items.reduce((s, i) => s + i.p.price * i.qty, 0)

  if (done) {
    return (
      <section className="section cart"><div className="container">
        <div className="done">
          <h1>Compra confirmada</h1>
          <p>Pedido nº {done.number}. Enviaremos a confirmação de envio para o seu e-mail.</p>
          <ul>{done.items.map((i) => <li key={i.id}>{i.qty}× {getProduct(i.id)?.name}</li>)}</ul>
          <div className="done-actions">
            <button className="btn-ghost" onClick={() => {
              if (!user) return
              const id = done.conversaId ?? abrirPedido(done.items, user.apelido)
              order.set({ ...done, conversaId: id }); setChatOpen(true)
            }}>Acertar com vendedor</button>
            <Link to="/" className="btn-brand" onClick={() => order.set(null)}>Voltar à loja</Link>
          </div>
        </div>
        {chatOpen && done.conversaId !== null && <ChatDrawer conversaId={done.conversaId} title={`Pedido nº ${done.number}`} onClose={() => setChatOpen(false)} />}
      </div></section>
    )
  }

  return (
    <section className="section cart"><div className="container">
      <h1>Sua sacola</h1>
      {items.length === 0 ? (
        <p className="muted">Sua sacola está vazia. <Link to="/categoria/batons" className="lnk">Continue comprando</Link></p>
      ) : (
        <div className="row g-5">
          <div className="col-lg-8">
            <ul className="lines">
              {items.map(({ id, qty, p }) => (
                <li key={id}>
                  <div><Link to={`/produto/${id}`}><strong>{p.name}</strong></Link><small>{p.tag}</small></div>
                  <div className="qty">
                    <button aria-label={`Diminuir ${p.name}`} onClick={() => setQty(id, qty - 1)}>−</button>
                    <span aria-live="polite">{qty}</span>
                    <button aria-label={`Aumentar ${p.name}`} onClick={() => setQty(id, qty + 1)}>+</button>
                  </div>
                  <span className="price">{brl(p.price * qty)}</span>
                </li>
              ))}
            </ul>
          </div>
          <aside className="col-lg-4">
            <div className="summary">
              <p>Total <strong className="price">{brl(total)}</strong></p>
              <button className="btn-brand" onClick={() => {
                if (!user) return nav('/entrar?next=/sacola')
                order.set({ number: 1000 + Math.floor(Math.random() * 9000), items: items.map(({ id, qty }) => ({ id, qty })), conversaId: null })
                clearCart()
              }}>Confirmar compra</button>
            </div>
          </aside>
        </div>
      )}
    </div></section>
  )
}
