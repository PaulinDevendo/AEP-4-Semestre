# Save Our Skin — Banco de dados (documento para o dev de banco)

> **Regra do projeto:** a **estrutura** do banco (`database/save_our_skin_web.sql`) **não muda**.
> Este documento pede apenas **dados** (seeds) e descreve como o sistema vai usar as tabelas
> que já existem. **Nenhuma tabela, coluna, constraint, índice ou policy nova é solicitada.**
> Nada aqui exige `prisma migrate` / `db push`; o backend usa apenas `prisma db pull` + `prisma generate`.

Estado atual: o schema **ainda não foi aplicado no Supabase**. Ordem sugerida:

1. Aplicar `database/save_our_skin_web.sql` (sem alterações).
2. Rodar os seeds da seção 2 (nesta ordem: categoria → produto → atendente → instituições → códigos).
3. Entregar a `DATABASE_URL` (conexão pooler do Supabase) ao dev do backend.

---

## 1. O que o front já pronto espera do banco

| Tela | Tabelas / view | Observação |
|---|---|---|
| Menu e categorias | `categoria` (`ativo = true`, `ORDER BY ordem`) | 5 categorias |
| Página de categoria | `produto` (`categoria_id`, `ativo = true`) | |
| Página de produto | `produto`, `codigo_disfarce` | dados do item + botão "i" com o tipo de agressão (`significado`, `urgencia`) e aviso rápido no hover |
| "Fale com o vendedor" | `conversa`, `mensagem`, `codigo_disfarce` | ver seção 3 |
| Painel — fila e prévia | `vw_previa_atendimento` | |
| Painel — ocorrências | `ocorrencia`, `encaminhamento`, `instituicao_apoio` | |
| Painel — login | `atendente` | JWT emitido pelo NestJS; **bcrypt** em `senha_hash` |

### Como o catálogo cabe nas colunas existentes (sem mudar nada)

- O front usa um `slug` de produto e uma linha de subtítulo (`tag`, ex.: "Batom cremoso · Vermelho").
  `produto` **não tem** essas colunas, então: o `slug` é derivado do `nome` no front e o
  subtítulo é gravado no fim de `descricao`, após ` | ` (o backend separa na leitura).
- `imagem_url` fica `NULL` por enquanto: as imagens são ilustrações SVG do front.
  Quando houver fotos, basta `UPDATE produto SET imagem_url = ...`.
- `cor_hex` guarda a cor do produto (`#RRGGBB`, 7 caracteres).
- Não há preço promocional no schema. "Ofertas" não é categoria; a promoção do esmalte é um banner.

---

## 2. Seeds a executar

Todos os dados são **fictícios**.

### 2.1 Categorias e produtos (gerado a partir do catálogo do front)

```sql
-- categoria
INSERT INTO categoria (nome, slug, descricao, ordem) VALUES
  ('Batons', 'batons', 'Cores intensas, acabamento cremoso e longa duração.', 1),
  ('Esmaltes', 'esmaltes', 'Cores vibrantes, secagem rápida e brilho de salão.', 2),
  ('Rosto', 'rosto', 'Bases, blushes e iluminadores para uma pele uniforme.', 3),
  ('Skincare', 'skincare', 'Rituais de cuidado para hidratar, tratar e proteger.', 4),
  ('Acessórios', 'acessorios', 'Pincéis, esponjas e necessaires para o dia a dia.', 5);

-- produto (categoria_id resolvido pelo slug)
INSERT INTO produto (categoria_id, nome, descricao, preco, cor_hex, estoque)
SELECT c.id, v.nome, v.descricao, v.preco, v.cor_hex, v.estoque
FROM (VALUES
  ('batons', 'Rouge Intense', 'Batom cremoso de cor intensa e acabamento acetinado. Hidrata enquanto colore. | Batom cremoso · Vermelho', 49.90::numeric, '#B3263F', 40),
  ('batons', 'Rosa Violáceo', 'Batom matte de textura aveludada em um rosa clássico para o dia a dia. | Batom matte · Rosa', 44.90::numeric, '#B76B7D', 35),
  ('batons', 'Nude Laço', 'Nude quente que combina com todos os tons de pele, com toque de seda. | Batom cremoso · Nude', 44.90::numeric, '#C98F86', 28),
  ('batons', 'Bordô Noturno', 'Bordô profundo e sofisticado, ideal para ocasiões especiais. | Batom matte · Bordô', 54.90::numeric, '#6E1A2E', 22),
  ('esmaltes', 'Esmalte Vermelho Vivo', 'O novo vermelho vivo da coleção: cobertura em duas camadas e brilho espelhado. | Esmalte cremoso · 9 ml', 19.90::numeric, '#C8102E', 80),
  ('esmaltes', 'Esmalte Rosa Névoa', 'Rosa suave e luminoso, de secagem rápida. | Esmalte cremoso · 9 ml', 17.90::numeric, '#E8A0B4', 60),
  ('esmaltes', 'Esmalte Nude Posse', 'Nude empoeirado que alonga e uniformiza as unhas. | Esmalte cremoso · 9 ml', 17.90::numeric, '#D7B8A8', 55),
  ('esmaltes', 'Base Fortalecedora', 'Fortalece e protege as unhas antes da cor. | Base para unhas · 9 ml', 22.90::numeric, '#F1DCBF', 45),
  ('rosto', 'Velvet Skin Toque', 'Base de cobertura média com acabamento acetinado, em 12 tons. | Base acetinada · 12 tons', 69.90::numeric, '#E3B7A0', 30),
  ('rosto', 'Blush Romantic', 'Blush compacto de pigmento macio que se constrói em camadas. | Blush compacto · Rosa antigo', 39.90::numeric, '#D98B9B', 38),
  ('rosto', 'Pó Invisível', 'Sela a maquiagem e controla o brilho sem pesar. | Pó solto · 10 g', 52.90::numeric, '#F3DCCB', 26),
  ('rosto', 'Glow Vigia', 'Luminosidade perolada para as maçãs do rosto. | Iluminador líquido · 15 ml', 59.90::numeric, '#EBCBD3', 24),
  ('skincare', 'Essence Rosé', 'Sérum iluminador com extrato de rosa que uniformiza o viço da pele. | Sérum iluminador · 30 ml', 89.90::numeric, '#EBCBD3', 20),
  ('skincare', 'Creme Reparador', 'Hidratação leve por 24 horas, para todos os tipos de pele. | Hidratante · 50 g', 74.90::numeric, '#F8EDEF', 33),
  ('skincare', 'Água Micelar', 'Remove a maquiagem e limpa suavemente, sem enxágue. | Demaquilante · 200 ml', 36.90::numeric, '#EAF1F4', 50),
  ('skincare', 'Protetor Escudo FPS 50', 'Toque seco, sem resíduo branco e com cor universal. | Protetor · 40 g', 64.90::numeric, '#F6E6D0', 41),
  ('acessorios', 'Kit Pincéis Cerca', 'Seis pincéis de cerdas macias para rosto e olhos. | Kit com 6 pincéis', 79.90::numeric, '#B76B7D', 18),
  ('acessorios', 'Esponja Rosa', 'Esponja de acabamento uniforme, suave para a pele. | Esponja para base', 19.90::numeric, '#E8A0B4', 70),
  ('acessorios', 'Necessaire Cofre', 'Necessaire com forro impermeável e fecho discreto. | Necessaire · Rosé', 49.90::numeric, '#EBCBD3', 25),
  ('acessorios', 'Espelho Eco', 'Espelho duplo com aumento, perfeito para a bolsa. | Espelho duplo', 24.90::numeric, '#C9A27A', 60)
) AS v(slug, nome, descricao, preco, cor_hex, estoque)
JOIN categoria c ON c.slug = v.slug;

```

### 2.2 Atendente de demonstração (para os analistas verem o painel)

Credenciais **genéricas e temporárias**, apenas para avaliação:

- e-mail: `atendente@gmail.com`
- senha: `SaveOurSkin123`

O banco guarda **somente o hash bcrypt**. Gere o hash (custo 10) e substitua `<HASH_BCRYPT>`:

```bash
node -e "console.log(require('bcryptjs').hashSync('SaveOurSkin123', 10))"
```

```sql
INSERT INTO atendente (nome, nome_exibicao, email, senha_hash, ativo, disponivel, max_conversas_simultaneas)
VALUES ('Atendente Demonstração', 'Atendente Demo', 'atendente@gmail.com', '<HASH_BCRYPT>', TRUE, FALSE, 3);
```

> Antes de qualquer uso real: apagar/trocar esta conta e a senha.
> Hoje o front valida essa mesma credencial localmente (protótipo); na fase da API passa a validar contra esta linha.

### 2.2b Usuária de demonstração (para os analistas usarem a loja)

Conta **genérica e temporária** na tela "Entrar" da loja:

- e-mail: `mariadapenha@gmail.com`
- senha: `SOSHELP`

Só o hash bcrypt vai para o banco (gere como na 2.2 e troque `<HASH_BCRYPT>`):

```sql
INSERT INTO usuaria (apelido, email, senha_hash)
VALUES ('Maria', 'mariadapenha@gmail.com', '<HASH_BCRYPT>');
```

> Apagar/trocar antes de qualquer uso real. Hoje o front valida essa credencial localmente (protótipo).
> **Regra de exibição:** as dicas de agressão (botão "i" e aviso no hover) e o "Fale com o vendedor"
> só funcionam com usuária logada; visitante não vê o significado dos produtos. Isso combina com
> `conversa.usuaria_id NOT NULL`.

### 2.3 Instituições de apoio (fictícias)

```sql
WITH e AS (
  INSERT INTO endereco (logradouro, numero, bairro, cidade, estado, cep) VALUES
    ('Rua Exemplo', '100', 'Centro', 'Maringá', 'PR', '87000-000'),
    ('Av. Modelo', '200', 'Centro', 'Maringá', 'PR', '87000-001'),
    ('Rua Sigilosa', 'S/N', 'Zona 1', 'Maringá', 'PR', '87000-002'),
    ('Rua das Flores', '300', 'Zona 2', 'Maringá', 'PR', '87000-003')
  RETURNING id, logradouro
)
INSERT INTO instituicao_apoio (nome, tipo, telefone, email, endereco_id, atende_24h)
SELECT v.nome, v.tipo, v.telefone, v.email, e.id, v.atende_24h
FROM (VALUES
  ('Delegacia da Mulher (fictícia)', 'delegacia',   '(44) 0000-0001', 'delegacia@exemplo.org', 'Rua Exemplo',    TRUE),
  ('CRAS Centro (fictício)',         'CRAS',        '(44) 0000-0002', 'cras@exemplo.org',      'Av. Modelo',     FALSE),
  ('Casa Abrigo Esperança (fictícia)','casa abrigo','(44) 0000-0003', NULL,                    'Rua Sigilosa',   TRUE),
  ('ONG Rede Acolher (fictícia)',    'ONG',         '(44) 0000-0004', 'rede@exemplo.org',      'Rua das Flores', FALSE)
) AS v(nome, tipo, telefone, email, logradouro, atende_24h)
JOIN e ON e.logradouro = v.logradouro;
```

### 2.4 Códigos dos produtos (`codigo_disfarce`)

Cada produto tem um código (tipo de agressão + urgência + orientação para quem atende). É o que a loja
mostra no botão "i" da página do produto e no aviso rápido ao passar o mouse, e o que o painel recebe
ao abrir a conversa. **Valores de protótipo**: a equipe pode mudar a qualquer momento com `UPDATE`
(é por isso que isto é tabela e não código). O `Esmalte Vermelho Vivo` é o botão de emergência.

Tipos usados: `violencia_fisica`, `violencia_psicologica`, `violencia_sexual`, `violencia_patrimonial`,
`ameaca`, `cerceamento`, `outro` (o esmalte usa `outro` + `emergencia`, só porque o CHECK exige um valor da lista).

```sql
INSERT INTO codigo_disfarce (produto_id, significado, urgencia, observacao)
SELECT p.id, v.significado, v.urgencia, v.observacao
FROM (VALUES
  ('Rouge Intense', 'ameaca', 'alta', 'Perguntar se está em local seguro antes de seguir.'),
  ('Rosa Violáceo', 'violencia_fisica', 'alta', 'Perguntar se há ferimentos e se precisa de atendimento médico.'),
  ('Nude Laço', 'cerceamento', 'media', 'Confirmar se pode falar agora e se o aparelho é monitorado.'),
  ('Bordô Noturno', 'violencia_sexual', 'alta', 'Acolher com cuidado; orientar sobre atendimento de saúde e delegacia.'),
  ('Esmalte Vermelho Vivo', 'outro', 'emergencia', 'Acionamento do botão de emergência: priorizar contato imediato.'),
  ('Esmalte Rosa Névoa', 'violencia_psicologica', 'media', 'Acolher sem julgar; evitar perguntas que culpem.'),
  ('Esmalte Nude Posse', 'violencia_patrimonial', 'media', 'Orientar sobre documentos e medidas protetivas.'),
  ('Base Fortalecedora', 'outro', 'baixa', 'Conversar para entender a situação antes de classificar.'),
  ('Velvet Skin Toque', 'violencia_sexual', 'alta', 'Acolher com cuidado; orientar sobre atendimento de saúde e delegacia.'),
  ('Blush Romantic', 'violencia_psicologica', 'media', 'Acolher sem julgar; evitar perguntas que culpem.'),
  ('Pó Invisível', 'outro', 'baixa', 'Conversar para entender a situação antes de classificar.'),
  ('Glow Vigia', 'cerceamento', 'media', 'Confirmar se pode falar agora e se o aparelho é monitorado.'),
  ('Essence Rosé', 'violencia_psicologica', 'media', 'Acolher sem julgar; evitar perguntas que culpem.'),
  ('Creme Reparador', 'violencia_fisica', 'alta', 'Perguntar se há ferimentos e se precisa de atendimento médico.'),
  ('Água Micelar', 'outro', 'baixa', 'Conversar para entender a situação antes de classificar.'),
  ('Protetor Escudo FPS 50', 'ameaca', 'media', 'Perguntar se está em local seguro antes de seguir.'),
  ('Kit Pincéis Cerca', 'cerceamento', 'media', 'Confirmar se pode falar agora e se o aparelho é monitorado.'),
  ('Esponja Rosa', 'outro', 'baixa', 'Conversar para entender a situação antes de classificar.'),
  ('Necessaire Cofre', 'violencia_patrimonial', 'media', 'Orientar sobre documentos e medidas protetivas.'),
  ('Espelho Eco', 'violencia_psicologica', 'baixa', 'Acolher sem julgar; evitar perguntas que culpem.')
) AS v(nome, significado, urgencia, observacao)
JOIN produto p ON p.nome = v.nome;
```

> Os nomes dos produtos já trazem a dica sutil (ex.: "Nude Laço", "Espelho Eco"). O seed da 2.1 usa os
> nomes atualizados e este casa os códigos pelo `nome`: se renomear um produto, ajuste os dois.
> Rode este INSERT **depois** do de `produto`.

---

## 3. Processo (como as tabelas são usadas, ponta a ponta)

### 3.1 Compra comum → denúncia (carrinho)

1. A usuária navega pelo catálogo (`categoria` → `produto`) e coloca itens na sacola.
2. Ao finalizar, o NestJS cria **uma** `ocorrencia` (`origem = 'pedido_web'`, `urgencia` do código mais grave dos itens,
   `status = 'aberta'`, `tipo = NULL`) e uma `ocorrencia_item` por produto (`quantidade > 0`).
3. A equipe cruza `ocorrencia_item` × `codigo_disfarce` para ler o conteúdo da denúncia.
4. Funciona com ou sem login (`ocorrencia.usuaria_id` aceita `NULL`).

### 3.2 "Fale com o vendedor" (chat)

1. Na página do produto, o botão abre a conversa. O NestJS:
   - procura o `codigo_disfarce` ativo do produto (ou da categoria dele);
   - cria `conversa` (`origem = 'produto'`, `status = 'aguardando'`, `produto_id`, `codigo_disfarce_id`);
   - **copia** `significado_inicial` e `urgencia_inicial` do código vigente (regra do schema: a tabela de códigos muda com o tempo).
2. Sem produto (atendimento geral): `origem = 'direta'`, campos de código `NULL`.
3. A conversa aparece na fila do painel via `vw_previa_atendimento`.
4. O atendente **assume** (`atendente_id`, `assumida_em`, `status = 'em_andamento'`) respeitando
   `atendente.max_conversas_simultaneas` e `atendente.disponivel`, e insere linha em `conversa_atendente`.
   Para evitar duas pessoas assumindo a mesma conversa, usar `UPDATE ... WHERE atendente_id IS NULL`
   (ou `SELECT ... FOR UPDATE`) numa transação.
5. Mensagens vão para `mensagem` (`autor` = `usuaria`/`atendente`/`sistema`). Quando a usuária cita um produto
   como código: `produto_id`, `codigo_disfarce_id`, `significado_codigo` e `contem_codigo = TRUE` (o painel destaca).
6. Encerrar: `status = 'encerrada'`, `fechada_em`, e fecha a linha de `conversa_atendente` (`liberada_em`, `motivo_saida`).
7. Do chat o atendente pode **criar a ocorrência** (`origem = 'chat'`), classificar (`tipo`, `urgencia`),
   mudar `status` e **encaminhar** para `instituicao_apoio` (`encaminhamento`, `UNIQUE (ocorrencia_id, instituicao_id)`).

### 3.3 Painel da equipe

- Acesso: só a rota `/atendente` mostra a 404 falsa → a palavra **"moda"** abre o login (as demais 404 do site são comuns, sem porta) → e-mail e senha da tabela `atendente`.
- Heartbeat: o painel atualiza `atendente.ultimo_ping` e `disponivel`.
- Qualquer atendente ativo acessa o painel (não existe perfil de administrador no banco).

### 3.4 Botão de emergência (fase 5, já decidido)

- É o produto `Esmalte Vermelho Vivo` + `codigo_disfarce` com `urgencia = 'emergencia'` (seção 2.4).
- Acionar cria `ocorrencia` (`origem = 'pedido_web'`, `urgencia = 'emergencia'`) + `ocorrencia_item`.
  Logada: abre também uma `conversa` ligada à ocorrência.
- Localização: só a **última** posição em `ocorrencia.latitude/longitude`. Áudio: tempo real, **não gravado**.

---

## 4. Regras do banco que o código respeita (e que você precisa manter)

1. `conversa.usuaria_id` é `NOT NULL`: **chat só para usuária cadastrada**. Sem cadastro existe apenas `ocorrencia`.
   (No protótipo do front o chat usa um "Visitante" só para demonstração.)
2. Excluir conta: apagar `conversa` da usuária (mensagens caem em cascata) → `ocorrencia.usuaria_id = NULL` → apagar `usuaria`.
3. **Sem RLS** (seria alterar o banco): o controle de acesso fica no NestJS, conferindo o dono do registro pelo token.
   Por isso o acesso direto ao Postgres **não pode** ser exposto ao navegador (sem chave anon do Supabase no front).
4. Os valores dos CHECKs (`significado`, `urgencia`, `origem`, `status`, `autor`) estão espelhados em `packages/shared`.
5. `senha_hash` e `pin_coacao`: sempre bcrypt; nunca texto puro.
6. Prisma com `previewFeatures = ["views"]` para ler `vw_previa_atendimento`.

## 5. Limitações do schema atual (informativo — **não** é pedido de alteração)

| Limitação | Como o projeto contorna |
|---|---|
| `produto` sem `slug` e sem subtítulo | slug derivado do nome; subtítulo no fim de `descricao` após ` \| ` |
| Sem preço promocional | promoção só como banner |
| Sem histórico de localização | guarda só a última posição |
| Áudio não tem onde ser guardado | transmissão ao vivo, sem gravação |
| Sem perfil de administrador | qualquer atendente ativo acessa o painel; restrição por perfil fica para depois |
| `produto` e `categoria` sem imagem de categoria | ilustrações SVG no front |

> Se algum item acima se tornar **essencial** para o projeto continuar, a mudança só será feita
> com justificativa e **confirmação explícita do responsável**, como combinado.
