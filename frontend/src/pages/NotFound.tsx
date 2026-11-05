import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginAtendente, STAFF_PATH } from '../data/auth'
import './notfound.css'

/** 404. Só com `door` (rota /atendente) a palavra "moda" vira a porta secreta para o login da equipe. */
export default function NotFound({ door = false }: { door?: boolean }) {
  const dlg = useRef<HTMLDialogElement>(null)
  const nav = useNavigate()
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    document.title = '404 | Save Our Skin'
    const m = document.createElement('meta')
    m.name = 'robots'; m.content = 'noindex,nofollow'
    document.head.appendChild(m)
    return () => { m.remove() }
  }, [])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setBusy(true); setErr('')
    const ok = await loginAtendente(String(f.get('email')), String(f.get('senha')))
    setBusy(false)
    if (ok) { dlg.current?.close(); nav(STAFF_PATH, { replace: true }) }
    else setErr('E-mail ou senha incorretos (após 5 erros, aguarde 30 s).')
  }

  return (
    <div className="nf">
      <div>
        <h1>404</h1>
        <p>Página não encontrada.</p>
        <p className="sub">Beleza e {door ? <button type="button" className="door" onClick={() => dlg.current?.showModal()}>moda</button> : 'moda'}</p>
        <Link to="/" className="back">Voltar para a loja</Link>
      </div>
      {door && <dialog ref={dlg} className="login" aria-labelledby="lg-t" onClose={() => setErr('')}>
        <form onSubmit={submit}>
          <h2 id="lg-t">Acesso</h2>
          <label htmlFor="lg-e">E-mail</label>
          <input id="lg-e" name="email" type="email" autoComplete="username" required />
          <label htmlFor="lg-s">Senha</label>
          <input id="lg-s" name="senha" type="password" autoComplete="current-password" required />
          <p className="err" role="alert">{err}</p>
          <div className="row-btn">
            <button className="btn-brand" type="submit" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</button>
            <button className="cancel" type="button" onClick={() => dlg.current?.close()}>Cancelar</button>
          </div>
        </form>
      </dialog>}
    </div>
  )
}
