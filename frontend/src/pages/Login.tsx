import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { loginUsuaria, logoutUsuaria, useUserSession } from '../data/userAuth'
import './account.css'

export default function Login() {
  const user = useUserSession()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const next = params.get('next')
  const dest = next && next.startsWith('/') && !next.startsWith('//') ? next : '/'

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setBusy(true); setErr('')
    try {
      await loginUsuaria(String(f.get('email')), String(f.get('senha')))
      nav(dest, { replace: true })
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Não foi possível entrar.')
    }
    setBusy(false)
  }

  if (user) {
    return (
      <section className="section account"><div className="container">
        <div className="account-card">
          <h1>Olá, {user.apelido}</h1>
          <p className="muted">Você está conectada.</p>
          <div className="row-btn"><Link to="/" className="btn-brand">Continuar comprando</Link><button className="btn-ghost" onClick={logoutUsuaria}>Sair</button></div>
        </div>
      </div></section>
    )
  }
  return (
    <section className="section account"><div className="container">
      <form className="account-card" onSubmit={submit}>
        <h1>Entrar</h1>
        <p className="muted">Acesse sua conta Save Our Skin.</p>
        <label htmlFor="u-e">E-mail</label>
        <input id="u-e" name="email" type="email" autoComplete="username" required />
        <label htmlFor="u-s">Senha</label>
        <input id="u-s" name="senha" type="password" autoComplete="current-password" required />
        <p className="err" role="alert">{err}</p>
        <button className="btn-brand" type="submit" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</button>
        <p className="alt">Ainda não tem conta? <Link to="/cadastro" className="lnk">Criar conta</Link></p>
      </form>
    </div></section>
  )
}
