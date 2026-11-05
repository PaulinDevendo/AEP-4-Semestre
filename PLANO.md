# Save Our Skin — Plano de Implementação

Fontes definitivas: `Context` (requisitos e stack) e `database/save_our_skin_web.sql` (banco).
A estrutura do banco **não muda** (só se o usuário autorizar explicitamente, ou se for essencial
para o projeto continuar, com justificativa e confirmação antes): nada de `prisma migrate`, `db push`, novas tabelas,
colunas, constraints ou policies. Inserir e atualizar **dados** (seeds, UPDATE em
`codigo_disfarce`) é permitido.

---

## Decisões já tomadas

| Tema | Decisão |
|---|---|
| Autenticação | Feita sobre as tabelas do Postgres (`usuaria`, `atendente`), hash bcrypt, JWT emitido pelo NestJS. Dois perfis: usuária e atendente. Sem Supabase Auth. |
| Chat | Tempo real via WebSocket Gateway (socket.io) no NestJS. |
| Primeira entrega | Vai direto para React (protótipo HTML puro descartado). Dados fictícios; banco ainda não aplicado no Supabase (outro dev/devops fará) — o código começa sem conexão com ele. |
| Gatilho do app | Chacoalhar o celular. O app vem depois; o foco agora é só a web. |
| Botão de emergência | Fica escondido atrás do banner **"Promoção do novo esmalte vermelho vivo"**. Ao ser acionado, chama a equipe e transmite **localização e áudio em tempo real**. O gatilho do app (futuro) abre essa mesma página. |
| Discrição/segurança | Todos os itens entram (saída rápida, modo coação, sem rastro no navegador, títulos neutros, HTTPS, LGPD). |
| Repositório | Monorepo com npm workspaces (`backend`, `frontend`, `packages/shared`). Git local; remoto virá depois. |
| Painel da equipe | Dentro do mesmo app React da loja (não há `painel` separado). Qualquer atendente logado acessa o admin (métricas, dashboards, solicitações); restrição por perfil fica para depois. |
| Acesso ao painel | Sem link na loja. A rota real vem de `VITE_STAFF_PATH`. A loja mostra uma falsa página 404 cujo subtítulo "Beleza e **moda**" tem a palavra "moda" como botão escondido: abre o login do atendente (JWT). Por ora, conta de demonstração `atendente@gmail.com` / `SaveOurSkin123` (validada no front; troca/remoção antes de uso real). Chunk do painel em lazy-load, build sem sourcemaps, API do atendente responde 404 sem token. |
| Identidade visual | Loja "Save Our Skin", símbolo ♀, tons de rosa. Assets em `frontend/public`; documentos por página em `visual/<página>/` (ex.: `visual/home/`). |
| Qualidade | Lighthouse máximo (desempenho, acessibilidade, boas práticas), velocidade acima de tudo: fontes self-hosted, Bootstrap enxuto (só grid), sem filtros/blur caros, contraste AA. Rodar Lighthouse antes de fechar cada tela. |
| Deploy | Cloudflare Pages (web) + Render pago (API) + Supabase, no mesmo domínio (`/api` → Render). TURN necessário para o áudio WebRTC. |
| Dependências | `.npmrc` com `legacy-peer-deps=true` (bug do npm 10 com peers em workspaces); TypeScript alinhado em ^6. |

### Como o botão de emergência cabe no banco sem alterá-lo

- O esmalte vermelho vivo é um `produto` comum do catálogo, ligado a um `codigo_disfarce`
  com `urgencia = 'emergencia'`.
- Acionar o botão cria uma `ocorrencia` com `origem = 'pedido_web'` (o pedido vem da página
  web, inclusive quando o app a abrir) e `urgencia = 'emergencia'`, mais um `ocorrencia_item`
  com o esmalte. Funciona com ou sem login (`usuaria_id` aceita NULL).
- Se a usuária estiver logada, abre também uma `conversa` (`origem = 'produto'`) ligada à
  ocorrência, para a equipe poder falar com ela.
- **Localização em tempo real**: `navigator.geolocation.watchPosition` → socket → painel.
  O banco guarda apenas a última posição em `ocorrencia.latitude/longitude` (não há tabela de
  histórico, e não criaremos uma).
- **Áudio em tempo real**: WebRTC entre o navegador da usuária e o painel, com o NestJS
  fazendo a sinalização pelo socket. O áudio **não é gravado**: não há onde guardá-lo, e isso
  também protege a usuária.
- Limitação conhecida: o navegador pede permissão de microfone e localização e mostra um
  indicador de gravação. A página precisa estar em HTTPS.

### Regras do banco que o código precisa respeitar

1. `conversa.usuaria_id` é NOT NULL: chat só com usuária cadastrada. Sem cadastro, a
   denúncia existe apenas como `ocorrencia`.
2. Excluir conta: apagar as `conversa` da usuária (as mensagens vão em cascata), deixar
   `ocorrencia.usuaria_id = NULL` e então remover a `usuaria` (os contatos vão em cascata).
3. Sem RLS (seria alterar o banco): todo controle de acesso fica no NestJS, conferindo o dono
   de cada registro pelo token.
4. Os CHECKs viram constantes compartilhadas e validação nos DTOs, para que nenhum insert seja
   recusado pelo banco.
5. Prisma apenas com `prisma db pull` + `prisma generate`, com `previewFeatures = ["views"]`
   para ler a `vw_previa_atendimento`.
6. Ao abrir uma conversa, o NestJS copia `significado_inicial` e `urgencia_inicial` do código
   vigente.
7. Produtos, categorias, códigos, atendentes e instituições entram por seed ou SQL (não há perfil
   de administrador no banco).

---

## Estrutura do monorepo

```
save-our-skin/
├── frontend/           # React + Bootstrap — loja e painel da equipe (rota secreta)
├── backend/            # NestJS + Prisma
├── mobile/             # React Native — fase futura
├── packages/
│   └── shared/         # constantes dos CHECKs, tipos e eventos do socket
├── database/
│   └── save_our_skin_web.sql   # referência; nunca executado pela aplicação
└── visual/             # .md por página (visual/home/, ...)
```

O painel vive no mesmo app, mas em chunk separado e rota secreta (ver Decisões).

---

## Fases

### Fase 1 — Telas em React com dados fictícios (sem API/banco)
Telas navegáveis com dados fictícios no formato das tabelas, usando Bootstrap via
CDN para já seguir o visual final.

Lado da usuária (loja):
- Home com vitrine, categorias e o banner do esmalte vermelho vivo
- Página de categoria e de produto, com o botão "Fale com o vendedor"
- Carrinho e finalização do "pedido"
- Login, cadastro (apelido, e-mail, senha, PIN de coação) e "Minha conta" (contatos de
  confiança, endereço, excluir conta)
- Chat "Fale com o vendedor" (simulado em JS)
- Página de emergência atrás do banner (simulação de compartilhamento de localização e áudio)
- Modo coação (loja "limpa") e botão de saída rápida

Lado da equipe (painel):
- Login do atendente e alternância de disponibilidade
- Fila de conversas com a prévia (produto escolhido, tipo de agressão, urgência, orientação)
- Tela da conversa com mensagens que contêm código destacadas
- Alerta de emergência com mapa da localização e player de áudio ao vivo (simulados)
- Ocorrências: classificar, mudar status, encaminhar para instituição

### Fase 2 — Base do monorepo e da API
- Monorepo, `packages/shared`, NestJS, Prisma (`db pull` / `generate`)
- Seeds: categorias, produtos (com o esmalte vermelho vivo), códigos de disfarce, atendentes,
  instituições
- Auth: cadastro e login da usuária, login do atendente, JWT, guards por perfil, login com PIN
  de coação

### Fase 3 — Loja e pedidos
- Catálogo (categorias e produtos ativos)
- Carrinho → `ocorrencia` (`pedido_web`) + `ocorrencia_item` + localização opcional
- Minha conta: contatos de confiança, endereço, exclusão de conta seguindo a ordem da regra 2

### Fase 4 — Chat em tempo real e painel
- Gateway socket.io com autenticação por JWT
- Abrir conversa por produto ou direta, copiando o código vigente
- Fila: conversas `aguardando`, assumir respeitando `max_conversas_simultaneas`, registrar em
  `conversa_atendente`, transferir e encerrar
- Heartbeat do painel (`ultimo_ping`, `disponivel`)
- Mensagens com produto como código (`contem_codigo`, `significado_codigo`) e marcação de `lida`
- Prévia via `vw_previa_atendimento`

### Fase 5 — Botão de emergência
- Página atrás do banner, ocorrência de emergência e conversa vinculada
- Localização ao vivo pelo socket, gravando a última posição na ocorrência
- Áudio ao vivo por WebRTC, com sinalização pelo NestJS
- Alerta destacado no painel

### Fase 6 — Ocorrências e encaminhamentos
- Criar ocorrência a partir do chat (`origem = 'chat'`) ou manualmente (`contato_manual`)
- Classificar tipo e urgência, mudar status, encerrar
- Encaminhar para `instituicao_apoio` (sem duplicar), consultar contatos de confiança

### Fase 7 — Discrição e segurança
- Saída rápida (troca para uma página neutra e limpa o histórico da aba)
- Modo coação completo
- Títulos, notificações e favicons neutros, cabeçalhos `no-store` nas rotas sensíveis
- HTTPS, rate limit no login, coleta mínima de dados (LGPD)

### Fase 8 — App React Native (futuro)
- Detectar o chacoalhar → abrir a página de emergência da web
- A configuração do gatilho fica salva só no aparelho (não há tabela para ela)

> Atualização (2026-11-05): dicas de agressão nos produtos só para usuária logada. Conta demo da usuária: `mariadapenha@gmail.com` / `SOSHELP` (rota `/entrar`, validada no front por ora).
