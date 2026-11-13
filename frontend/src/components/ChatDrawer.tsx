import { useEffect, useRef, useState } from 'react'
import { api } from '../lib/api'
import { usePoll } from '../hooks/usePoll'
import { getUserSession } from '../data/userAuth'

interface Msg { id: number; autor: 'usuaria' | 'atendente'; conteudo: string }
interface Dados { status: string; mensagens: Msg[] }

export default function ChatDrawer({ conversaId, title, onClose }: { conversaId: number; title: string; onClose: () => void }) {
  const token = getUserSession()?.token
  const { data, error, reload } = usePoll(() => api<Dados>(`/conversas/${conversaId}`, { token }), 3000, [conversaId])
  const [text, setText] = useState('')
  const [err, setErr] = useState('')
  const end = useRef<HTMLDivElement>(null)
  const msgs = data?.mensagens ?? []
  const fechada = data?.status === 'encerrada' || data?.status === 'abandonada'
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [msgs.length])

  async function enviar(t: string) {
    setErr('')
    try { await api(`/conversas/${conversaId}/mensagens`, { body: { conteudo: t }, token }) }
    catch (e) { setErr(e instanceof Error ? e.message : 'Não foi possível enviar.'); setText(t) }
    await reload()
  }

  return (
    <aside className="chat" role="dialog" aria-label="Fale com o vendedor">
      <header>
        <div><strong>Fale com o vendedor</strong><small>{title}</small></div>
        <button className="icon-btn" aria-label="Fechar conversa" onClick={onClose}>✕</button>
      </header>
      <div className="chat-body" aria-live="polite">
        <p className="bubble them">Olá! Sou da equipe de atendimento da loja. Como posso ajudar?</p>
        {msgs.map((m) => <p key={m.id} className={`bubble ${m.autor === 'usuaria' ? 'me' : 'them'}`}>{m.conteudo}</p>)}
        {fechada && <p className="bubble them">Atendimento encerrado. Obrigada pelo contato!</p>}
        {(err || (error && !data)) && <p className="bubble them" role="alert">{err || error}</p>}
        <div ref={end} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); const t = text.trim(); if (t) { setText(''); void enviar(t) } }}>
        <label className="sr-only" htmlFor="chat-in">Mensagem</label>
        <input id="chat-in" value={text} onChange={(e) => setText(e.target.value)} placeholder="Escreva sua mensagem" autoComplete="off" maxLength={2000} disabled={fechada} />
        <button type="submit" className="btn-brand" disabled={fechada}>Enviar</button>
      </form>
    </aside>
  )
}
