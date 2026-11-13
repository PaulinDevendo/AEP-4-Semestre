# Deploy — Save Our Skin

Arquitetura (PLANO.md): **Cloudflare Pages** (site) → `/api/*` → **Render** (API NestJS) → **Supabase** (Postgres).
O navegador só fala com o domínio da loja. Uma Pages Function (`frontend/functions/api/[[path]].ts`)
repassa `/api` para o Render, e só a API acessa o banco.

```
navegador ──► Cloudflare Pages (frontend/dist)
                 └─ /api/*  ──► Render: save-our-skin-api (NestJS + Prisma) ──► Supabase Postgres
```

## 1. Banco (Supabase): já feito

O projeto `dfoxopapfwajjmwjtfxw` já está com tudo aplicado:

- `database/save_our_skin_web.sql` (schema, sem alterações);
- `database/seed.sql` (categorias, 20 produtos, códigos, instituições e as contas demo);
- RLS ligado em todas as tabelas, sem policies: a API REST pública do Supabase não lê nada.
  A API NestJS conecta como `postgres`, que ignora RLS;
- `REVOKE` da view `vw_previa_atendimento` para `anon`/`authenticated`.

Se precisar recriar em outro projeto: rode os dois `.sql` nessa ordem no SQL Editor.

**O que você precisa pegar:** Supabase > botão **Connect** > aba **Direct** (*Connection string*)
> Type **URI** > Method **Session pooler**. Não use a aba *Framework*, que é para `supabase-js` no
navegador e não se aplica aqui. A string tem este formato:

```
postgresql://postgres.dfoxopapfwajjmwjtfxw:[SENHA]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

Troque `[SENHA]` pela senha do banco, sem os colchetes. Para criar uma senha nova: Project Settings > Database >
Reset database password. Prefira só letras e números, porque `@ # / ? %` quebram a URL. Essa string é o `DATABASE_URL`.
Use o *Session pooler*, não a *Direct connection*: a direta é só IPv6 e o Render não tem IPv6.
Quem já tem o projeto funcionando localmente pode pedir a string pronta a quem tem o `backend/.env`,
por um canal privado, porque ela contém a senha.

Conexão verificada em 2026-11-12: com essa string, a API respondeu `/api/health`, o catálogo, os logins e o painel.

## 2. API (Render)

1. Render > **New > Blueprint** > escolha este repositório. O `render.yaml` da raiz cria o serviço
   `save-our-skin-api` (build `npm ci --include=dev && npm run build -w backend`, health check `/api/health`).
2. Quando pedir as variáveis:
   - `DATABASE_URL`: a string do *Session pooler* (passo 1).
   - `JWT_SECRET`: o Render gera sozinho.
   - `CORS_ORIGINS`: não precisa (o proxy do Pages deixa tudo na mesma origem).
3. Depois do deploy, abra `https://<serviço>.onrender.com/api/health`: precisa responder `{"ok":true}`.
   Se responder 503, o `DATABASE_URL` está errado (senha, ou usou a conexão direta).

> **Região:** o Supabase deste projeto fica em São Paulo (`sa-east-1`) e o Render não tem região no
> Brasil. Escolha **Virginia (US East)**, a mais próxima. Para isso, troque a região no painel ou
> adicione `region: virginia` no `render.yaml` antes de criar o Blueprint.

## 3. Site (Cloudflare Pages)

Workers & Pages > **Create > Pages > Connect to Git** > este repositório:

| Campo | Valor |
|---|---|
| Framework preset | None |
| Root directory | `frontend` |
| Build command | `cd .. && npm ci --include=dev && npm run build -w frontend` |
| Build output directory | `dist` |

**Variáveis (Settings > Variables and Secrets), em Production e Preview:**

| Nome | Valor |
|---|---|
| `API_ORIGIN` | `https://<serviço>.onrender.com` (sem barra no fim) |
| `NODE_VERSION` | `22` |

Como o *Root directory* é `frontend`, o Pages encontra a pasta `frontend/functions` (o proxy `/api`)
e o `frontend/public/_headers` (CSP, no-store nas rotas sensíveis). Depois de mudar `API_ORIGIN`, faça
um novo deploy, porque a variável só vale a partir do deploy seguinte.

## 4. Conferir (5 min)

1. `https://<site>/api/health` → `{"ok":true}` (proxy do Pages → Render → Supabase).
2. A loja carrega as categorias e os produtos (vêm do banco).
3. `/entrar` com `mariadapenha@gmail.com` / `SOSHELP` → as dicas aparecem nos produtos.
4. Produto → sacola → **Confirmar compra** → **Acertar com vendedor** → mande uma mensagem.
5. Em outra janela: `/atendente` → clique em "moda" → `atendente@gmail.com` / `SaveOurSkin123`
   → a conversa aparece na fila → **Assumir** → responda → a resposta chega no chat da usuária.

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| Loja mostra "Não foi possível carregar a loja" | `API_ORIGIN` ausente ou errado no Pages, ou a API está fora do ar |
| `/api/health` responde 502 com "API_ORIGIN não configurada" | faltou a variável no Pages, ou não houve novo deploy depois de criá-la |
| `/api/health` responde 503 | `DATABASE_URL` errado no Render |
| Render falha no build com `nest: not found` | o build command perdeu o `--include=dev` |
| Login demora ~1 min na primeira vez | plano gratuito do Render "dormindo"; o PLANO prevê plano pago |

## Desenvolvimento local

```bash
npm install
cp backend/.env.example backend/.env   # preencher DATABASE_URL e JWT_SECRET
npm run dev:backend                    # http://localhost:3000/api
npm run dev:frontend                   # http://localhost:5173 (o Vite repassa /api)
```

O `schema.prisma` vem do banco (`npm run db:pull -w backend`). **Nunca** rode `prisma migrate` nem
`db push`: a estrutura do banco é a do `database/save_our_skin_web.sql`.
