import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout, useSession } from '../../data/auth'
import { getProduct } from '../../data/products'
import {
  assumir, atualizarOcorrencia, conversas, criarOcorrencia, encerrar, enviarMensagem, INSTITUICOES,
  ocorrencias, STATUS_OCORRENCIA, SIGNIFICADOS, URGENCIAS, type Conversa,
} from '../../data/staffStore'
import './staff.css'

const label = (v: string) => v.replace(/_/g, ' ')
const hora = (t: number) => new Date(t).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

export default function Panel() {
  const session = useSession()
  const nav = useNavigate()
  const [tab, setTab] = useState<'conversas' | 'ocorrencias'>('conversas')
  const [online, setOnline] = useState(true)
  if (!session) return null
  const sair = () => { logout(); nav('/', { replace: true }) }
  return (
    <div className="staff">
      <header className="staff-bar">
        <strong>Equipe · {session.nomeExibicao}</strong>
        <nav aria-label="Seções">
          <button aria-pressed={tab === 'conversas'} onClick={() => setTab('conversas')}>Conversas</button>
          <button aria-pressed={tab === 'ocorrencias'} onClick={() => setTab('ocorrencias')}>Ocorrências</button>
        </nav>
        <label className="sw"><input type="checkbox" checked={online} onChange={(e) => setOnline(e.target.checked)} /> {online ? 'Disponível' : 'Indisponível'}</label>
        <button className="out" onClick={sair}>Sair</button>
      </header>
      <main>{tab === 'conversas' ? <Conversas nome={session.nomeExibicao} online={online} /> : <Ocorrencias />}</main>
    </div>
  )
}

function Conversas({ nome, online }: { nome: string; online: boolean }) {
  const list = conversas.use()
  const [sel, setSel] = useState<number | null>(null)
  const [text, setText] = useState('')
  const c = list.find((x) => x.id === (sel ?? list[0]?.id))
  const ativas = list.filter((x) => x.status === 'em_andamento' && x.atendente === nome).length
  return (
    <div className="split">
      <ul className="queue" aria-label="Fila de conversas">
        {list.map((x) => (
          <li key={x.id}>
            <button aria-current={x.id === c?.id} onClick={() => setSel(x.id)}>
              <span className={`dot ${x.urgencia ?? 'none'}`} aria-hidden="true" />
              <b>{x.apelido}</b> <small>{label(x.status)}</small>
              <span className="sub">{x.produtoId ? getProduct(x.produtoId)?.name : 'Atendimento direto'}</span>
            </button>
          </li>
        ))}
      </ul>
      {c ? (
        <section className="thread" aria-label={`Conversa com ${c.apelido}`}>
          <Previa c={c} />
          <div className="msgs">
            {c.mensagens.map((m) => (
              <p key={m.id} className={`m ${m.autor}${m.contemCodigo ? ' code' : ''}`}>
                <small>{m.autor} · {hora(m.enviadaEm)}</small>{m.conteudo}
                {m.contemCodigo && <em> ⚑ código: {label(m.significadoCodigo ?? 'a definir')}</em>}
              </p>
            ))}
          </div>
          <div className="actions">
            {c.status === 'aguardando' && <button className="primary" disabled={!online || ativas >= 3} onClick={() => assumir(c.id, nome)}>{online ? (ativas >= 3 ? 'Limite de 3 conversas' : 'Assumir') : 'Fique disponível para assumir'}</button>}
            {c.status === 'em_andamento' && <button onClick={() => encerrar(c.id)}>Encerrar</button>}
            {c.status !== 'aguardando' && <button onClick={() => criarOcorrencia(c)}>Criar ocorrência</button>}
          </div>
          {c.status === 'em_andamento' && (
            <form onSubmit={(e) => { e.preventDefault(); const t = text.trim(); if (t) { enviarMensagem(c.id, 'atendente', t); setText('') } }}>
              <label className="sr-only" htmlFor="rep">Resposta</label>
              <input id="rep" value={text} onChange={(e) => setText(e.target.value)} placeholder="Responder como vendedora" autoComplete="off" />
              <button className="primary" type="submit">Enviar</button>
            </form>
          )}
        </section>
      ) : <p className="empty">Nenhuma conversa.</p>}
    </div>
  )
}

/** Equivale à view vw_previa_atendimento. */
function Previa({ c }: { c: Conversa }) {
  const p = c.produtoId ? getProduct(c.produtoId) : null
  return (
    <dl className="previa">
      <div><dt>Usuária</dt><dd>{c.apelido}</dd></div>
      <div><dt>Produto escolhido</dt><dd>{p?.name ?? '—'}</dd></div>
      <div><dt>Tipo</dt><dd>{c.significado ? label(c.significado) : 'a definir (tabela de códigos)'}</dd></div>
      <div><dt>Urgência</dt><dd>{c.urgencia ?? '—'}</dd></div>
      <div className="wide"><dt>Orientação da equipe</dt><dd>{c.orientacao ?? '—'}</dd></div>
    </dl>
  )
}

function Ocorrencias() {
  const list = ocorrencias.use()
  if (!list.length) return <p className="empty">Nenhuma ocorrência.</p>
  return (
    <div className="table-wrap">
      <table>
        <caption className="sr-only">Ocorrências</caption>
        <thead><tr><th>#</th><th>Usuária</th><th>Origem</th><th>Tipo</th><th>Urgência</th><th>Status</th><th>Encaminhar para</th></tr></thead>
        <tbody>
          {list.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td><td>{o.apelido}</td><td>{label(o.origem)}</td>
              <td><select aria-label={`Tipo da ocorrência ${o.id}`} value={o.tipo ?? ''} onChange={(e) => atualizarOcorrencia(o.id, { tipo: (e.target.value || null) as never })}><option value="">não classificada</option>{SIGNIFICADOS.map((s) => <option key={s} value={s}>{label(s)}</option>)}</select></td>
              <td><select aria-label={`Urgência da ocorrência ${o.id}`} value={o.urgencia} onChange={(e) => atualizarOcorrencia(o.id, { urgencia: e.target.value as never })}>{URGENCIAS.map((s) => <option key={s}>{s}</option>)}</select></td>
              <td><select aria-label={`Status da ocorrência ${o.id}`} value={o.status} onChange={(e) => atualizarOcorrencia(o.id, { status: e.target.value as never })}>{STATUS_OCORRENCIA.map((s) => <option key={s} value={s}>{label(s)}</option>)}</select></td>
              <td><select aria-label={`Instituição da ocorrência ${o.id}`} value={o.instituicao ?? ''} onChange={(e) => atualizarOcorrencia(o.id, { instituicao: e.target.value || null, status: e.target.value ? 'encaminhada' : o.status })}><option value="">—</option>{INSTITUICOES.map((s) => <option key={s}>{s}</option>)}</select></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
