import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout, useSession, type StaffSession } from '../../data/auth'
import {
  assumir, atualizarOcorrencia, criarOcorrencia, encaminhar, encerrar, enviarMensagem, listarConversas, listarInstituicoes,
  listarMensagens, listarOcorrencias, ping, STATUS_OCORRENCIA, SIGNIFICADOS, URGENCIAS, type Conversa, type Instituicao, type Ocorrencia,
} from '../../data/staffStore'
import { usePoll } from '../../hooks/usePoll'
import './staff.css'

const label = (v: string) => v.replace(/_/g, ' ')
const hora = (t: string) => new Date(t).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
const msgErro = (e: unknown) => (e instanceof Error ? e.message : 'Erro')

export default function Panel() {
  const session = useSession()
  const nav = useNavigate()
  const [tab, setTab] = useState<'conversas' | 'ocorrencias'>('conversas')
  const [online, setOnline] = useState(true)

  useEffect(() => {
    ping(true).then((r) => setOnline(r.disponivel)).catch(() => {})
    const t = setInterval(() => { ping().catch(() => {}) }, 30_000)
    return () => clearInterval(t)
  }, [])

  if (!session) return null
  const sair = async () => { await ping(false).catch(() => {}); logout(); nav('/', { replace: true }) }
  const alternar = async (v: boolean) => { setOnline(v); setOnline((await ping(v).catch(() => ({ disponivel: !v }))).disponivel) }
  return (
    <div className="staff">
      <header className="staff-bar">
        <strong>Equipe · {session.nomeExibicao}</strong>
        <nav aria-label="Seções">
          <button aria-pressed={tab === 'conversas'} onClick={() => setTab('conversas')}>Conversas</button>
          <button aria-pressed={tab === 'ocorrencias'} onClick={() => setTab('ocorrencias')}>Ocorrências</button>
        </nav>
        <label className="sw"><input type="checkbox" checked={online} onChange={(e) => void alternar(e.target.checked)} /> {online ? 'Disponível' : 'Indisponível'}</label>
        <button className="out" onClick={() => void sair()}>Sair</button>
      </header>
      <main>{tab === 'conversas' ? <Conversas session={session} online={online} /> : <Ocorrencias />}</main>
    </div>
  )
}

function Conversas({ session, online }: { session: StaffSession; online: boolean }) {
  const fila = usePoll(listarConversas, 4000)
  const list = fila.data ?? []
  const [sel, setSel] = useState<number | null>(null)
  const [text, setText] = useState('')
  const [err, setErr] = useState('')
  const c = list.find((x) => x.id === (sel ?? list[0]?.id))
  const msgs = usePoll(() => (c ? listarMensagens(c.id) : Promise.resolve([])), 3000, [c?.id])
  const ativas = list.filter((x) => x.status === 'em_andamento' && x.atendenteId === session.id).length
  const limite = session.maxConversas

  async function acao(fn: () => Promise<unknown>) {
    setErr('')
    try { await fn() } catch (e) { setErr(msgErro(e)) }
    await Promise.all([fila.reload(), msgs.reload()])
  }

  if (!fila.data) return <p className="empty">{fila.error ?? 'Carregando…'}</p>
  const minha = c?.atendenteId === session.id
  return (
    <div className="split">
      <ul className="queue" aria-label="Fila de conversas">
        {list.map((x) => (
          <li key={x.id}>
            <button aria-current={x.id === c?.id} onClick={() => { setSel(x.id); setErr('') }}>
              <span className={`dot ${x.urgencia ?? 'none'}`} aria-hidden="true" />
              <b>{x.apelido}</b> <small>{label(x.status)}</small>
              <span className="sub">{x.produto ?? 'Atendimento direto'}{x.atendente && x.atendenteId !== session.id ? ` · ${x.atendente}` : ''}</span>
            </button>
          </li>
        ))}
      </ul>
      {c ? (
        <section className="thread" aria-label={`Conversa com ${c.apelido}`}>
          <Previa c={c} />
          <div className="msgs">
            {(msgs.data ?? []).map((m) => (
              <p key={m.id} className={`m ${m.autor}${m.contemCodigo ? ' code' : ''}`}>
                <small>{m.autor} · {hora(m.enviadaEm)}</small>{m.conteudo}
                {m.contemCodigo && <em> ⚑ código: {label(m.significadoCodigo ?? 'a definir')}</em>}
              </p>
            ))}
          </div>
          <div className="actions">
            {c.status === 'aguardando' && <button className="primary" disabled={!online || ativas >= limite} onClick={() => void acao(() => assumir(c.id))}>{online ? (ativas >= limite ? `Limite de ${limite} conversas` : 'Assumir') : 'Fique disponível para assumir'}</button>}
            {c.status === 'em_andamento' && minha && <button onClick={() => void acao(() => encerrar(c.id))}>Encerrar</button>}
            {c.status !== 'aguardando' && !c.ocorrenciaId && <button onClick={() => void acao(() => criarOcorrencia(c.id))}>Criar ocorrência</button>}
            {c.ocorrenciaId && <small>Ocorrência nº {c.ocorrenciaId}</small>}
          </div>
          {err && <p className="staff-err" role="alert">{err}</p>}
          {c.status === 'em_andamento' && minha && (
            <form onSubmit={(e) => { e.preventDefault(); const t = text.trim(); if (t) { setText(''); void acao(() => enviarMensagem(c.id, t)) } }}>
              <label className="sr-only" htmlFor="rep">Resposta</label>
              <input id="rep" value={text} onChange={(e) => setText(e.target.value)} placeholder="Responder como vendedora" autoComplete="off" maxLength={2000} />
              <button className="primary" type="submit">Enviar</button>
            </form>
          )}
        </section>
      ) : <p className="empty">Nenhuma conversa.</p>}
    </div>
  )
}

function Previa({ c }: { c: Conversa }) {
  return (
    <dl className="previa">
      <div><dt>Usuária</dt><dd>{c.apelido}</dd></div>
      <div><dt>Produto escolhido</dt><dd>{c.produto ?? '—'}</dd></div>
      <div><dt>Tipo</dt><dd>{c.significado ? label(c.significado) : 'a definir'}</dd></div>
      <div><dt>Urgência</dt><dd>{c.urgencia ?? '—'}</dd></div>
      <div className="wide"><dt>Orientação da equipe</dt><dd>{c.orientacao ?? '—'}</dd></div>
    </dl>
  )
}

function Ocorrencias() {
  const oc = usePoll(listarOcorrencias, 8000)
  const [inst, setInst] = useState<Instituicao[]>([])
  const [err, setErr] = useState('')
  useEffect(() => { listarInstituicoes().then(setInst).catch(() => {}) }, [])

  async function mudar(fn: () => Promise<unknown>) {
    setErr('')
    try { await fn() } catch (e) { setErr(msgErro(e)) }
    await oc.reload()
  }

  if (!oc.data) return <p className="empty">{oc.error ?? 'Carregando…'}</p>
  if (!oc.data.length) return <p className="empty">Nenhuma ocorrência.</p>
  const nomeInst = (id: number) => inst.find((i) => i.id === id)?.nome ?? `#${id}`
  return (
    <>
      {err && <p className="staff-err" role="alert">{err}</p>}
      <div className="table-wrap">
        <table>
          <caption className="sr-only">Ocorrências</caption>
          <thead><tr><th>#</th><th>Usuária</th><th>Origem</th><th>Tipo</th><th>Urgência</th><th>Status</th><th>Encaminhar para</th></tr></thead>
          <tbody>
            {oc.data.map((o: Ocorrencia) => (
              <tr key={o.id}>
                <td>{o.id}</td><td>{o.apelido}</td><td>{label(o.origem)}</td>
                <td><select aria-label={`Tipo da ocorrência ${o.id}`} value={o.tipo ?? ''} onChange={(e) => void mudar(() => atualizarOcorrencia(o.id, { tipo: (e.target.value || null) as Ocorrencia['tipo'] }))}><option value="">não classificada</option>{SIGNIFICADOS.map((s) => <option key={s} value={s}>{label(s)}</option>)}</select></td>
                <td><select aria-label={`Urgência da ocorrência ${o.id}`} value={o.urgencia} onChange={(e) => void mudar(() => atualizarOcorrencia(o.id, { urgencia: e.target.value as Ocorrencia['urgencia'] }))}>{URGENCIAS.map((s) => <option key={s}>{s}</option>)}</select></td>
                <td><select aria-label={`Status da ocorrência ${o.id}`} value={o.status} onChange={(e) => void mudar(() => atualizarOcorrencia(o.id, { status: e.target.value as Ocorrencia['status'] }))}>{STATUS_OCORRENCIA.map((s) => <option key={s} value={s}>{label(s)}</option>)}</select></td>
                <td>
                  {o.instituicoes.length > 0 && <small>{o.instituicoes.map(nomeInst).join(', ')}<br /></small>}
                  <select aria-label={`Encaminhar a ocorrência ${o.id}`} value="" onChange={(e) => { const id = Number(e.target.value); if (id) void mudar(() => encaminhar(o.id, id)) }}>
                    <option value="">{o.instituicoes.length ? 'adicionar…' : '—'}</option>
                    {inst.filter((i) => !o.instituicoes.includes(i.id)).map((i) => <option key={i.id} value={i.id}>{i.nome}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
