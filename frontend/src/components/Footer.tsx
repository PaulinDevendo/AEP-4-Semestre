import { InstagramIcon, MailIcon, PinterestIcon, Venus } from './Icons'

const col = (title: string, items: string[]) => (
  <div className="col-6 col-lg-2">
    <h4>{title}</h4>
    <ul>{items.map((i) => <li key={i}><a href="#" onClick={(e) => e.preventDefault()}>{i}</a></li>)}</ul>
  </div>
)

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-5" data-reveal>
          <div className="col-lg-4">
            <a href="/" className="brand"><Venus size={20} /><span>Save Our Skin</span></a>
            <p className="about">Cosméticos e cuidados pensados para você. Cores, texturas e rituais para celebrar a sua beleza todos os dias.</p>
            <div className="social">
              <a href="#" aria-label="Instagram" onClick={(e) => e.preventDefault()}><InstagramIcon /></a>
              <a href="#" aria-label="Pinterest" onClick={(e) => e.preventDefault()}><PinterestIcon /></a>
            </div>
          </div>
          {col('A loja', ['Sobre a loja', 'Política de privacidade', 'Trocas e devoluções'])}
          {col('Pagamento', ['Cartão de crédito', 'Pix', 'Boleto'])}
          <div className="col-lg-4">
            <h4>Newsletter</h4>
            <p className="about">Receba lançamentos e ofertas em primeira mão.</p>
            <form className="newsletter" onSubmit={(e) => e.preventDefault()}>
              <label className="sr-only" htmlFor="nl">E-mail</label>
              <MailIcon size={18} />
              <input id="nl" type="email" placeholder="Seu e-mail" />
              <button type="submit">Assinar</button>
            </form>
          </div>
        </div>
        <div className="legal">© 2026 Save Our Skin. Todos os direitos reservados.</div>
      </div>
    </footer>
  )
}
