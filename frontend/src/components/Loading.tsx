export function Loading({ failed = false }: { failed?: boolean }) {
  return (
    <section className="section catalog">
      <div className="container">
        <p className="muted" role={failed ? 'alert' : 'status'}>
          {failed ? 'Não foi possível carregar a loja agora. Recarregue a página em instantes.' : 'Carregando…'}
        </p>
      </div>
    </section>
  )
}
