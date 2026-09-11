-- =============================================================================
-- PROJETO SAVE OUR SKIN
-- Banco de dados - PostgreSQL
-- AEP - Engenharia de Software - Unicesumar
-- =============================================================================
--
-- O sistema e uma plataforma web de denuncia com aparencia de loja de
-- maquiagem. A usuaria escolhe um produto e clica em "Falar com o vendedor".
-- Cada produto representa um tipo de agressao, entao o atendente ja recebe a
-- conversa com uma previa da situacao. Dentro do chat os dois seguem usando
-- codigos.
--
-- ESCOPO
-- O projeto e apenas web. Nao ha aplicativo mobile.
--
-- ORDEM DAS TABELAS
-- As tabelas foram criadas na ordem em que sao referenciadas. Uma chave
-- estrangeira so pode apontar para uma tabela que ja existe, entao endereco
-- vem antes de usuaria, categoria vem antes de produto, e assim por diante.
--
-- OBSERVACAO SOBRE SEGURANCA
-- Este e um prototipo academico. Antes de qualquer uso real seria necessario
-- configurar controle de acesso por linha (RLS) no Supabase, para que uma
-- usuaria nao consiga ler os dados de outra.
-- =============================================================================


-- =============================================================================
-- ENDERECO
-- Tabela separada porque tanto a usuaria quanto as instituicoes de apoio tem
-- endereco. Assim nao precisamos repetir as mesmas colunas em duas tabelas.
-- =============================================================================

CREATE TABLE endereco (
    id           SERIAL PRIMARY KEY,
    logradouro   VARCHAR(150),                    -- rua, avenida
    numero       VARCHAR(10),                     -- varchar por causa de "S/N" e "123-A"
    complemento  VARCHAR(100),                    -- apartamento, bloco
    bairro       VARCHAR(100),
    cidade       VARCHAR(100),
    estado       CHAR(2),                         -- sigla da UF, ex: PR
    cep          VARCHAR(9),                      -- varchar para nao perder o zero da frente
    pais         VARCHAR(50) DEFAULT 'Brasil',
    criado_em    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =============================================================================
-- CATEGORIA
-- Categorias do catalogo da loja (batons, bases, perfumes).
-- =============================================================================

CREATE TABLE categoria (
    id         SERIAL PRIMARY KEY,
    nome       VARCHAR(80) NOT NULL,
    slug       VARCHAR(80) NOT NULL UNIQUE,       -- nome usado na URL
    descricao  TEXT,
    ordem      SMALLINT DEFAULT 0,                -- posicao no menu
    ativo      BOOLEAN DEFAULT TRUE,              -- esconde sem apagar
    criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =============================================================================
-- PRODUTO
-- As maquiagens da loja. Cada produto pode representar um tipo de agressao,
-- e essa ligacao fica na tabela codigo_disfarce.
-- =============================================================================

CREATE TABLE produto (
    id            SERIAL PRIMARY KEY,
    categoria_id  INTEGER NOT NULL,
    nome          VARCHAR(120) NOT NULL,
    descricao     TEXT,
    preco         NUMERIC(10,2) NOT NULL,         -- numeric e nao float, por causa de dinheiro
    cor_hex       CHAR(7),                        -- cor no formato #RRGGBB
    imagem_url    TEXT,
    estoque       INTEGER DEFAULT 0,
    ativo         BOOLEAN DEFAULT TRUE,
    criado_em     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (categoria_id) REFERENCES categoria(id),
    CHECK (preco > 0)
);


-- =============================================================================
-- USUARIA
-- Guardamos apelido em vez de nome completo, para coletar o minimo de
-- informacao possivel sobre a usuaria.
-- =============================================================================

CREATE TABLE usuaria (
    id             SERIAL PRIMARY KEY,
    apelido        VARCHAR(60),
    email          VARCHAR(150) UNIQUE,
    senha_hash     TEXT NOT NULL,                 -- guardamos o hash, nunca a senha
    telefone       VARCHAR(20),
    endereco_id    INTEGER,
    pin_coacao     TEXT,                          -- hash de um PIN que abre a loja em modo limpo
    criado_em      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso  TIMESTAMP,

    FOREIGN KEY (endereco_id) REFERENCES endereco(id)
);


-- =============================================================================
-- CONTATO_CONFIANCA
-- Pessoas que podem ser avisadas em caso de emergencia.
-- ON DELETE CASCADE: se a usuaria apagar a conta, os contatos dela somem junto.
-- =============================================================================

CREATE TABLE contato_confianca (
    id          SERIAL PRIMARY KEY,
    usuaria_id  INTEGER NOT NULL,
    nome        VARCHAR(120) NOT NULL,
    telefone    VARCHAR(20) NOT NULL,
    parentesco  VARCHAR(50),                      -- irma, vizinha, amiga
    prioridade  SMALLINT DEFAULT 1,               -- 1 = avisar primeiro
    criado_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (usuaria_id) REFERENCES usuaria(id) ON DELETE CASCADE
);


-- =============================================================================
-- CODIGO_DISFARCE
-- Tabela mais importante do projeto. Ela diz o que cada produto significa.
-- Exemplo: batom vermelho = ameaca.
--
-- Isso fica em tabela e nao no codigo do sistema porque o grupo ainda vai
-- mudar esses significados varias vezes durante o desenvolvimento. Sendo
-- tabela, basta dar um UPDATE.
--
-- O codigo pode apontar para um produto especifico ou para uma categoria
-- inteira. Por isso as duas colunas aceitam NULL, mas o CHECK no final obriga
-- que pelo menos uma delas esteja preenchida.
-- =============================================================================

CREATE TABLE codigo_disfarce (
    id            SERIAL PRIMARY KEY,
    produto_id    INTEGER,
    categoria_id  INTEGER,
    significado   VARCHAR(30) NOT NULL,           -- tipo de agressao
    urgencia      VARCHAR(15) NOT NULL,
    observacao    TEXT,                           -- orientacao para quem vai atender
    ativo         BOOLEAN DEFAULT TRUE,
    criado_em     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (produto_id) REFERENCES produto(id),
    FOREIGN KEY (categoria_id) REFERENCES categoria(id),

    -- O CHECK abaixo funciona como uma lista de valores permitidos. Se alguem
    -- tentar gravar uma palavra fora da lista, o banco recusa.
    CHECK (significado IN ('violencia_fisica', 'violencia_psicologica',
                           'violencia_sexual', 'violencia_patrimonial',
                           'ameaca', 'cerceamento', 'outro')),
    CHECK (urgencia IN ('baixa', 'media', 'alta', 'emergencia')),
    CHECK (produto_id IS NOT NULL OR categoria_id IS NOT NULL)
);


-- =============================================================================
-- OCORRENCIA
-- O registro da denuncia em si.
-- usuaria_id aceita NULL para o caso de denuncia sem cadastro.
-- =============================================================================

CREATE TABLE ocorrencia (
    id            SERIAL PRIMARY KEY,
    usuaria_id    INTEGER,
    origem        VARCHAR(20) NOT NULL,           -- por onde a denuncia chegou
    tipo          VARCHAR(30),                    -- fica NULL ate ser classificada
    urgencia      VARCHAR(15) DEFAULT 'media',
    status        VARCHAR(20) DEFAULT 'aberta',
    latitude      NUMERIC(9,6),                   -- localizacao informada pelo navegador
    longitude     NUMERIC(9,6),
    relato        TEXT,
    criada_em     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    encerrada_em  TIMESTAMP,

    FOREIGN KEY (usuaria_id) REFERENCES usuaria(id),

    CHECK (origem IN ('pedido_web', 'chat', 'contato_manual')),
    CHECK (tipo IS NULL OR tipo IN ('violencia_fisica', 'violencia_psicologica',
                                    'violencia_sexual', 'violencia_patrimonial',
                                    'ameaca', 'cerceamento', 'outro')),
    CHECK (urgencia IN ('baixa', 'media', 'alta', 'emergencia')),
    CHECK (status IN ('aberta', 'em_atendimento', 'encaminhada',
                      'encerrada', 'falso_positivo')),
    CHECK (encerrada_em IS NULL OR encerrada_em >= criada_em)
);


-- =============================================================================
-- OCORRENCIA_ITEM
-- Os produtos que a usuaria colocou no carrinho.
-- Para quem olha de fora e um pedido de maquiagem. Cruzando com a tabela
-- codigo_disfarce, vira o conteudo da denuncia.
-- =============================================================================

CREATE TABLE ocorrencia_item (
    id             SERIAL PRIMARY KEY,
    ocorrencia_id  INTEGER NOT NULL,
    produto_id     INTEGER,
    quantidade     SMALLINT DEFAULT 1,

    FOREIGN KEY (ocorrencia_id) REFERENCES ocorrencia(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produto(id),
    CHECK (quantidade > 0)
);


-- =============================================================================
-- ATENDENTE
-- Equipe que responde as conversas.
-- Duas colunas de nome: o real, que so a equipe ve, e o de exibicao, que
-- aparece para a usuaria como se fosse uma vendedora da loja.
-- =============================================================================

CREATE TABLE atendente (
    id                         SERIAL PRIMARY KEY,
    nome                       VARCHAR(120) NOT NULL,
    nome_exibicao              VARCHAR(60) NOT NULL,
    email                      VARCHAR(150) NOT NULL UNIQUE,
    senha_hash                 TEXT NOT NULL,
    ativo                      BOOLEAN DEFAULT TRUE,   -- a conta pode fazer login
    disponivel                 BOOLEAN DEFAULT FALSE,  -- esta online agora
    max_conversas_simultaneas  SMALLINT DEFAULT 3,
    ultimo_ping                TIMESTAMP,              -- ultima vez que o painel deu sinal
    criado_em                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =============================================================================
-- CONVERSA
-- O chat "Falar com o vendedor". E o centro do sistema, porque e onde a
-- denuncia realmente acontece.
--
-- produto_id guarda a maquiagem que a usuaria clicou antes de abrir o chat.
-- E dele que sai a previa que o atendente recebe. Fica NULL quando a usuaria
-- clica direto no atendimento geral, sem passar por um produto.
--
-- significado_inicial e urgencia_inicial copiam o que o codigo significava no
-- momento em que a conversa foi aberta. Copiamos porque a tabela
-- codigo_disfarce muda com o tempo, e sem essa copia uma conversa antiga
-- passaria a mostrar um significado diferente do que a usuaria quis dizer.
-- Esses dois campos sao preenchidos pelo sistema (NestJS) na hora de criar
-- a conversa.
-- =============================================================================

CREATE TABLE conversa (
    id                   SERIAL PRIMARY KEY,
    usuaria_id           INTEGER NOT NULL,
    atendente_id         INTEGER,                 -- NULL = ainda na fila
    ocorrencia_id        INTEGER,
    produto_id           INTEGER,                 -- produto que originou a conversa
    codigo_disfarce_id   INTEGER,
    origem               VARCHAR(20) DEFAULT 'direta',
    status               VARCHAR(20) DEFAULT 'aguardando',
    significado_inicial  VARCHAR(30),             -- copia do significado do codigo
    urgencia_inicial     VARCHAR(15),             -- copia da urgencia do codigo
    aberta_em            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assumida_em          TIMESTAMP,               -- quando um atendente pegou
    ultima_mensagem_em   TIMESTAMP,
    fechada_em           TIMESTAMP,

    FOREIGN KEY (usuaria_id) REFERENCES usuaria(id),
    FOREIGN KEY (atendente_id) REFERENCES atendente(id),
    FOREIGN KEY (ocorrencia_id) REFERENCES ocorrencia(id),
    FOREIGN KEY (produto_id) REFERENCES produto(id),
    FOREIGN KEY (codigo_disfarce_id) REFERENCES codigo_disfarce(id),

    CHECK (origem IN ('produto', 'direta')),
    CHECK (status IN ('aguardando', 'em_andamento', 'encerrada', 'abandonada')),
    CHECK (fechada_em IS NULL OR fechada_em >= aberta_em)
);


-- =============================================================================
-- CONVERSA_ATENDENTE
-- Historico de quem atendeu cada conversa. Uma conversa pode passar por mais
-- de um atendente (troca de turno, por exemplo), e a coluna atendente_id da
-- tabela conversa guarda apenas o atual.
-- =============================================================================

CREATE TABLE conversa_atendente (
    id            SERIAL PRIMARY KEY,
    conversa_id   INTEGER NOT NULL,
    atendente_id  INTEGER NOT NULL,
    assumida_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    liberada_em   TIMESTAMP,
    motivo_saida  VARCHAR(60),                    -- encerramento, troca de turno, etc.

    FOREIGN KEY (conversa_id) REFERENCES conversa(id) ON DELETE CASCADE,
    FOREIGN KEY (atendente_id) REFERENCES atendente(id),
    CHECK (liberada_em IS NULL OR liberada_em >= assumida_em)
);


-- =============================================================================
-- MENSAGEM
-- As mensagens trocadas dentro da conversa.
--
-- Dentro do chat a usuaria tambem pode usar codigos, mencionando outros
-- produtos. Por isso a mensagem tem produto_id e significado_codigo.
-- A coluna contem_codigo serve para o painel destacar essas mensagens.
-- =============================================================================

CREATE TABLE mensagem (
    id                  SERIAL PRIMARY KEY,
    conversa_id         INTEGER NOT NULL,
    autor               VARCHAR(15) NOT NULL,     -- quem escreveu
    conteudo            TEXT NOT NULL,
    produto_id          INTEGER,                  -- produto usado como codigo
    codigo_disfarce_id  INTEGER,
    significado_codigo  VARCHAR(30),
    contem_codigo       BOOLEAN DEFAULT FALSE,
    enviada_em          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lida                BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (conversa_id) REFERENCES conversa(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produto(id),
    FOREIGN KEY (codigo_disfarce_id) REFERENCES codigo_disfarce(id),

    CHECK (autor IN ('usuaria', 'atendente', 'sistema'))
);


-- =============================================================================
-- INSTITUICAO_APOIO
-- Delegacias, CRAS, casas de acolhimento e ONGs para onde a equipe pode
-- encaminhar uma ocorrencia.
-- =============================================================================

CREATE TABLE instituicao_apoio (
    id           SERIAL PRIMARY KEY,
    nome         VARCHAR(150) NOT NULL,
    tipo         VARCHAR(60),                     -- delegacia, CRAS, casa abrigo, ONG
    telefone     VARCHAR(20),
    email        VARCHAR(150),
    endereco_id  INTEGER,
    atende_24h   BOOLEAN DEFAULT FALSE,
    ativo        BOOLEAN DEFAULT TRUE,
    criado_em    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (endereco_id) REFERENCES endereco(id)
);


-- =============================================================================
-- ENCAMINHAMENTO
-- Liga uma ocorrencia a uma instituicao.
-- Uma ocorrencia pode ir para varias instituicoes e uma instituicao recebe
-- varias ocorrencias, entao esta e uma tabela de relacionamento N para N.
-- =============================================================================

CREATE TABLE encaminhamento (
    id              SERIAL PRIMARY KEY,
    ocorrencia_id   INTEGER NOT NULL,
    instituicao_id  INTEGER NOT NULL,
    atendente_id    INTEGER,                      -- quem fez o encaminhamento
    encaminhado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacao      TEXT,

    FOREIGN KEY (ocorrencia_id) REFERENCES ocorrencia(id),
    FOREIGN KEY (instituicao_id) REFERENCES instituicao_apoio(id),
    FOREIGN KEY (atendente_id) REFERENCES atendente(id),

    UNIQUE (ocorrencia_id, instituicao_id)        -- evita encaminhar duas vezes
);


-- =============================================================================
-- INDICES
-- Chave primaria e UNIQUE ja criam indice sozinhos. Criamos indice apenas nas
-- colunas mais usadas em WHERE e ORDER BY, porque indice deixa a consulta mais
-- rapida mas a gravacao mais lenta.
-- =============================================================================

CREATE INDEX idx_produto_categoria    ON produto(categoria_id);
CREATE INDEX idx_ocorrencia_usuaria   ON ocorrencia(usuaria_id);
CREATE INDEX idx_ocorrencia_status    ON ocorrencia(status);
CREATE INDEX idx_conversa_status      ON conversa(status);
CREATE INDEX idx_conversa_atendente   ON conversa(atendente_id);
CREATE INDEX idx_mensagem_conversa    ON mensagem(conversa_id);
CREATE INDEX idx_codigo_produto       ON codigo_disfarce(produto_id);


-- =============================================================================
-- VIEW DA PREVIA DO ATENDENTE
-- Junta as informacoes que o atendente precisa ver quando abre uma conversa:
-- quem e a usuaria, qual produto ela clicou e o que aquilo significa.
--
-- Criamos uma view para nao repetir esses JOIN em todo lugar do sistema.
-- Usamos LEFT JOIN porque nem toda conversa tem produto (quando a usuaria fala
-- direto com o atendente) e nem toda conversa tem usuaria cadastrada.
-- =============================================================================

CREATE VIEW vw_previa_atendimento AS
SELECT
    c.id                   AS conversa_id,
    c.status,
    c.origem,
    c.aberta_em,
    c.assumida_em,
    c.ultima_mensagem_em,
    u.id                   AS usuaria_id,
    u.apelido,
    p.nome                 AS produto_escolhido,
    p.imagem_url           AS produto_imagem,
    c.significado_inicial  AS tipo_agressao,
    c.urgencia_inicial,
    cd.observacao          AS orientacao_equipe
FROM conversa c
LEFT JOIN usuaria         u  ON u.id  = c.usuaria_id
LEFT JOIN produto         p  ON p.id  = c.produto_id
LEFT JOIN codigo_disfarce cd ON cd.id = c.codigo_disfarce_id;


-- =============================================================================
-- FIM
-- =============================================================================
