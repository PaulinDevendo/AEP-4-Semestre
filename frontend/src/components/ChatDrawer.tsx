import { useEffect, useRef, useState } from 'react'
import { conversas, enviarMensagem } from '../data/staffStore'

/** "Fale com o vendedor" — simulado. Lê/escreve na mesma store que o painel da equipe. */
export default function ChatDrawer({ conversaId, title, onClose }: { conversaId: number; title: string; onClose: () => void }) {
  const conversa = conversas.use().find((c) => c.id === conversaId)
  const [text, setText] = useState('')
  const end = useRef<HTMLDivElement>(null)
  const count = conversa?.mensagens.length ?? 0
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [count])
  if (!conversa) return null
  const msgs = conversa.mensagens.filter((m) => m.autor !== 'sistema')
  return (
    <aside className="chat" role="dialog" aria-label="Fale com o vendedor">
      <header>
        <div><strong>Fale com o vendedor</strong><small>{title}</small></div>
        <button className="icon-btn" aria-label="Fechar conversa" onClick={onClose}>✕</button>
      </header>
      <div className="chat-body" aria-live="polite">
        <p className="bubble them">Olá! Sou da equipe de atendimento da loja. Como posso ajudar?</p>
        {msgs.map((m) => <p key={m.id} className={`bubble ${m.autor === 'usuaria' ? 'me' : 'them'}`}>{m.conteudo}</p>)}
        <div ref={end} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); const t = text.trim(); if (t) { enviarMensagem(conversaId, 'usuaria', t); setText('') } }}>
        <label className="sr-only" htmlFor="chat-in">Mensagem</label>
        <input id="chat-in" value={text} onChange={(e) => setText(e.target.value)} placeholder="Escreva sua mensagem" autoComplete="off" />
        <button type="submit" className="btn-brand">Enviar</button>
      </form>
    </aside>
  )
}
