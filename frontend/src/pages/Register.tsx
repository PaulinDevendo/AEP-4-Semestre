import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registrarUsuaria } from '../data/userAuth'
import './account.css'

export default function Register() {
  const nav = useNavigate()
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const senha = String(f.get('senha'))
    const pin = String(f.get('pin') || '')
    if (senha.length < 6) return setErr('A senha precisa ter pelo menos 6 caracteres.')
    if (senha !== String(f.get('senha2'))) return setErr('As senhas não coincidem.')
    if (pin && !/^\d{4,6}$/.test(pin)) return setErr('O PIN deve ter de 4 a 6 números.')
    setBusy(true); setErr('')
    try {
      await registrarUsuaria({ apelido: String(f.get('apelido')), email: String(f.get('email')), senha, pin: pin || undefined })
      nav('/', { replace: true })
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Não foi possível cadastrar.')
    }
    setBusy(false)
  }

  return (
    <section className="section account"><div className="container">
      <form className="account-card" onSubmit={submit}>
        <h1>Criar conta</h1>
        <p className="muted">Cadastre-se para acompanhar seus pedidos.</p>
        <label htmlFor="r-a">Como podemos te chamar?</label>
        <input id="r-a" name="apelido" maxLength={60} autoComplete="nickname" required />
        <label htmlFor="r-e">E-mail</label>
        <input id="r-e" name="email" type="email" autoComplete="email" required />
        <label htmlFor="r-s">Senha</label>
        <input id="r-s" name="senha" type="password" autoComplete="new-password" required />
        <label htmlFor="r-s2">Confirmar senha</label>
        <input id="r-s2" name="senha2" type="password" autoComplete="new-password" required />
        <label htmlFor="r-p">PIN de acesso rápido (opcional)</label>
        <input id="r-p" name="pin" inputMode="numeric" maxLength={6} autoComplete="off" />
        <p className="err" role="alert">{err}</p>
        <button className="btn-brand" type="submit" disabled={busy}>{busy ? 'Cadastrando…' : 'Cadastrar'}</button>
        <p className="alt">Já tem conta? <Link to="/entrar" className="lnk">Entrar</Link></p>
      </form>
    </div></section>
  )
}
