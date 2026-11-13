# 🌸 Save Our Skin
### Beleza que acolhe. Tecnologia que protege.

<p align="center">
  <img src="https://img.shields.io/badge/Save%20Our%20Skin-Proteção%20e%20Acolhimento-ec8cae?style=for-the-badge" />
  <img src="https://img.shields.io/badge/ODS-05-e85d9e?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Protótipo%20Frontend-dc9ab8?style=for-the-badge" />
</p>

<p align="center">
  <strong>Uma plataforma que se apresenta como uma loja de maquiagem, mas esconde um canal discreto de acolhimento e ajuda para mulheres em situação de violência.</strong>
</p>

---

## 💗 Sobre o projeto

O **Save Our Skin** é um projeto acadêmico desenvolvido para a AEP, alinhado ao **ODS 5 — Igualdade de Gênero**, da Organização das Nações Unidas.

A proposta é unir tecnologia, acessibilidade e segurança em uma plataforma que, visualmente, funciona como uma loja virtual de maquiagem.

Por trás dessa aparência, existe um sistema de comunicação discreto que permite identificar situações de violência, solicitar ajuda e estabelecer contato com uma equipe de atendimento.

A experiência foi pensada para que uma mulher possa acessar os recursos de apoio sem que a plataforma revele imediatamente sua verdadeira finalidade a outras pessoas.

> 🌷 **Nosso propósito:** transformar uma experiência cotidiana em uma oportunidade de acolhimento, orientação e proteção.

## ✨ Funcionalidades

| Recurso | Descrição |
|---|---|
| 💄 Loja virtual | Interface de e-commerce com categorias e produtos de maquiagem. |
| 🔐 Acesso de usuária | Login que libera funcionalidades discretas de identificação. |
| 🕊️ Códigos ocultos | Produtos representam diferentes tipos de violência. |
| 🛍️ Sacola de compras | Fluxo de compra convencional utilizado como caminho para solicitar ajuda. |
| 💬 Chat de atendimento | Comunicação entre a usuária e a equipe de acolhimento. |
| 🆘 Registro de ocorrências | Identificação, classificação e acompanhamento de situações relatadas. |
| 👩‍💻 Painel de atendimento | Ambiente reservado para a equipe responsável. |
| 🏥 Encaminhamento | Possibilidade de direcionar ocorrências para instituições de apoio. |

---

## 🖥️ 1. Como executar o projeto

### Pré-requisitos

- Node.js instalado.
- npm instalado.
- Projeto clonado ou baixado localmente.

### Instalação

Abra o terminal na pasta raiz do projeto e execute:

```bash
npm install
```

Em seguida, inicie o frontend:

```bash
npm run dev:frontend
```

Acesse o endereço indicado no terminal. Normalmente:

```text
http://localhost:5173
```

---

## 🔑 2. Contas para avaliação

O protótipo disponibiliza duas contas fictícias para testar os diferentes níveis de acesso.

### 👩 Usuária — Cliente da loja

| Campo | Credencial |
|---|---|
| E-mail | `mariadapenha@gmail.com` |
| Senha | `SOSHELP` |
| Acesso | Ícone de pessoa no topo ou `/entrar` |

### 💗 Atendente — Equipe de acolhimento

| Campo | Credencial |
|---|---|
| E-mail | `atendente@gmail.com` |
| Senha | `SaveOurSkin123` |
| Acesso | Porta secreta em `/atendente` |

Também é possível criar uma conta fictícia por meio da página `/cadastro`.

**Importante:** todas as contas e informações são simuladas. Nenhum dado é persistido em banco de dados nesta versão.

---

## 🛍️ 3. Roteiro de avaliação — 5 minutos

O roteiro abaixo apresenta as principais funcionalidades do sistema e permite explorar tanto a loja quanto os recursos de apoio escondidos.

### 💄 Etapa 1 — A fachada: loja de maquiagem

<details>
<summary><strong>Visualizar instruções</strong></summary>

1. Acesse a página inicial sem realizar login.
2. Navegue pelas categorias:
   - Batons;
   - Esmaltes;
   - Rosto;
   - Skincare;
   - Acessórios.
3. Abra alguns produtos e explore suas informações.

**Resultado esperado:** a plataforma apresenta uma loja virtual convencional, sem indicar a existência de funcionalidades de apoio.

</details>

### 🔐 Etapa 2 — Acesso da usuária

<details>
<summary><strong>Visualizar instruções</strong></summary>

1. Clique no ícone de pessoa no cabeçalho.
2. Informe as credenciais:

```text
E-mail: mariadapenha@gmail.com
Senha: SOSHELP
```

3. Realize o login.

**Resultado esperado:** o acesso libera informações discretas associadas aos produtos.

</details>

### 🌷 Etapa 3 — Os códigos escondidos nos produtos

<details>
<summary><strong>Visualizar instruções e tabela de códigos</strong></summary>

Cada produto possui uma associação com um tipo de violência ou necessidade de orientação.

Com a usuária autenticada, existem três formas de identificar essas informações:

- **Hover:** passe o mouse sobre o produto para visualizar um aviso curto.
- **Navegação por teclado:** utilize a tecla Tab para explorar os elementos.
- **Detalhes do produto:** clique no botão `i`, localizado ao lado do nome, para visualizar o tipo de violência, a urgência e a explicação correspondente.

Os próprios nomes dos produtos também carregam referências sutis aos códigos.

#### Tabela de identificação

| Categoria | Produto | Código associado | Urgência |
|---|---|---|---|
| Batons | Rouge Intense | Ameaça | 🔴 Alta |
| Batons | Rosa Violáceo | Violência física | 🔴 Alta |
| Batons | Nude Laço | Cerceamento de liberdade | 🟡 Média |
| Batons | Bordô Noturno | Violência sexual | 🔴 Alta |
| Esmaltes | Esmalte Vermelho Vivo | Pedido de ajuda imediato | 🆘 Emergência |
| Esmaltes | Esmalte Rosa Névoa | Violência psicológica | 🟡 Média |
| Esmaltes | Esmalte Nude Posse | Violência patrimonial | 🟡 Média |
| Esmaltes | Base Fortalecedora | Outro / orientação | 🟢 Baixa |
| Rosto | Velvet Skin Toque | Violência sexual | 🔴 Alta |
| Rosto | Blush Romantic | Violência psicológica | 🟡 Média |
| Rosto | Pó Invisível | Outro / orientação | 🟢 Baixa |
| Rosto | Glow Vigia | Cerceamento de liberdade | 🟡 Média |
| Skincare | Essence Rosé | Violência psicológica | 🟡 Média |
| Skincare | Creme Reparador | Violência física | 🔴 Alta |
| Skincare | Água Micelar | Outro / orientação | 🟢 Baixa |
| Skincare | Protetor Escudo FPS 50 | Ameaça | 🟡 Média |
| Acessórios | Kit Pincéis Cerca | Cerceamento de liberdade | 🟡 Média |
| Acessórios | Esponja Rosa | Outro / orientação | 🟢 Baixa |
| Acessórios | Necessaire Cofre | Violência patrimonial | 🟡 Média |
| Acessórios | Espelho Eco | Violência psicológica | 🟢 Baixa |

**Arquivo de referência:** `frontend/src/data/codes.ts`

</details>

### 🛒 Etapa 4 — O caminho para solicitar ajuda

<details>
<summary><strong>Visualizar instruções</strong></summary>

Esta etapa demonstra como uma compra aparentemente convencional pode se transformar em um canal de comunicação com a equipe.

1. Abra um produto.
2. Clique em **Adicionar à sacola**.
3. Acesse **Ver sacola**, pelo ícone correspondente no cabeçalho.
4. Clique em **Confirmar compra**.
5. Aguarde a tela de confirmação do pedido.

A tela apresenta uma confirmação de compra convencional, com número de pedido fictício.

É somente nesse ambiente que aparece a opção:

**💗 Acertar com vendedor**

O botão funciona como um mecanismo discreto de solicitação de ajuda.

- Quem acessa a plataforma por engano pode simplesmente ignorá-lo.
- Quem precisa de apoio pode utilizá-lo para criar uma ocorrência e iniciar uma conversa com a equipe.

6. Clique em **Acertar com vendedor**.
7. Envie uma mensagem pelo chat.

**Resultado esperado:** a ocorrência é criada e a mensagem fica disponível para a equipe no painel de atendimento.

</details>

### 👩‍💻 Etapa 5 — A porta secreta e o painel da equipe

<details>
<summary><strong>Visualizar instruções de acesso</strong></summary>

O ambiente de atendimento possui uma entrada propositalmente discreta.

**1. Acesse:**

```text
http://localhost:5173/atendente
```

**2. Identifique a página:**

O endereço apresenta uma página semelhante a um erro 404 convencional.

**3. Encontre a porta secreta:**

No subtítulo que contém a frase "Beleza e moda", a palavra **moda** funciona como um botão oculto.

Clique nela para abrir a tela de autenticação.

**4. Entre com as credenciais:**

```text
E-mail: atendente@gmail.com
Senha: SaveOurSkin123
```

**5. Explore o painel de atendimento:**

#### 💬 Conversas

- Visualização da fila de atendimento.
- Prévia do produto selecionado.
- Identificação do tipo de violência associado.
- Indicação do nível de urgência.
- Orientações para a pessoa responsável pelo atendimento.
- Possibilidade de assumir uma conversa e responder à usuária.

#### 📋 Ocorrências

- Classificação do tipo de violência.
- Alteração do nível de urgência.
- Atualização do status da ocorrência.
- Encaminhamento para instituições fictícias.

#### 🟢 Disponibilidade da equipe

- Interruptor para controlar a disponibilidade do atendente.
- Limite de três conversas simultâneas por atendente.

**Teste recomendado:** retorne à conversa iniciada na etapa anterior, assuma o atendimento e envie uma resposta. Depois, verifique se a mensagem aparece no chat da usuária.

</details>

---

## 🏗️ 4. Arquitetura e tecnologias

O Save Our Skin está sendo desenvolvido com uma arquitetura preparada para evoluir de um protótipo de interface para uma aplicação completa.

### Estrutura planejada

| Camada | Tecnologia | Finalidade |
|---|---|---|
| Frontend Web | React | Interface da plataforma |
| Linguagem | TypeScript | Tipagem e organização do código |
| Backend | NestJS | Regras de negócio e APIs |
| ORM | Prisma | Comunicação com o banco de dados |
| Banco de dados | Supabase | Persistência das informações |
| Mobile | React Native | Aplicativo em fase futura |

---

## 🚧 5. Funcionalidades em desenvolvimento

O projeto ainda está em fase de prototipação. Algumas funcionalidades fazem parte do planejamento, mas não estão implementadas nesta versão.

| Funcionalidade | Situação |
|---|---|
| Loja virtual e navegação | Protótipo disponível |
| Autenticação de usuária | Simulada no frontend |
| Códigos ocultos nos produtos | Disponível |
| Sacola e confirmação de compra | Simuladas |
| Chat entre usuária e atendente | Protótipo disponível |
| Painel de atendimento | Protótipo disponível |
| Registro e classificação de ocorrências | Simulados |
| Banner do esmalte vermelho vivo | Pendente |
| Página de emergência | Pendente |
| Localização e áudio em tempo real | Pendente |
| Modo coação com PIN | Pendente |
| Saída rápida | Pendente |
| Backend com NestJS | Pendente |
| Banco de dados Supabase | Pendente |
| Aplicativo React Native | Fase futura |

### 🔒 Segurança e privacidade

A segurança é um dos pilares conceituais do Save Our Skin.

Nesta versão:

- Os dados são fictícios.
- Não existe persistência em banco de dados.
- As credenciais são validadas diretamente no navegador.
- A atualização da página encerra a sessão.
- Não existe autenticação real no servidor.
- O modo coação e a saída rápida ainda não foram implementados.

Na arquitetura planejada, a autenticação será transferida para o servidor, utilizando **bcrypt e JWT**.

A implementação de recursos como localização e áudio em tempo real dependerá de mecanismos adequados de consentimento, segurança e proteção dos dados.

> ⚠️ **Atenção:** este projeto é um protótipo acadêmico e não deve ser utilizado como canal real de denúncia ou atendimento emergencial.

---

## 📁 6. Organização dos arquivos

Alguns arquivos importantes para compreender o funcionamento e a arquitetura do projeto:

| Arquivo / Diretório | Descrição |
|---|---|
| `Context` | Requisitos e arquitetura do projeto |
| `PLANO.md` | Planejamento, fases e decisões |
| `banco.md` | Documentação do banco de dados, seeds e processo de aplicação |
| `database/save_our_skin_web.sql` | Schema SQL do banco de dados |
| `visual/` | Identidade visual e referências das páginas |
| `frontend/src/data/codes.ts` | Associação entre produtos e tipos de violência |

---

## 🌸 7. Nosso propósito

O Save Our Skin nasceu da ideia de que a tecnologia pode ir além da funcionalidade: ela também pode representar acolhimento, empatia e proteção.

A proposta é oferecer uma experiência discreta para mulheres que podem não encontrar um ambiente seguro para pedir ajuda abertamente.

Mais do que uma plataforma, o projeto representa o compromisso de utilizar a tecnologia como instrumento de transformação social.

<p align="center">
  <strong>🌷 Save Our Skin</strong>
  <br/>
  <em>Beleza que acolhe. Tecnologia que protege.</em>
  <br/><br/>
  <strong>ODS 5 — Igualdade de Gênero</strong>
</p>
