# Modelagem do sistema

> **Artefato central da Sprint 3.** Os modelos explicam a estrutura e o comportamento do **Radar UFLA** (achados e perdidos do campus) e correspondem aos requisitos de [`docs/requisitos/requisitos.md`](../requisitos/requisitos.md) e ao código em [`API/`](../../API/).

**Convenção de identificadores:** este documento usa os mesmos IDs de `requisitos.md` (`RF-01`, `RNF-03`, `RN-04`, `US-01`). As Issues citadas são as do [`backlog-produto.md`](../backlog-produto.md).

**Legenda de situação dos fluxos:** OK implementado no código · WAR modelado, implementação planejada (Issue indicada).

## 1. Modelos selecionados

| Modelo                                                   | Tipo           | Pergunta que ele ajuda a responder                                              | Requisitos relacionados                     |
| -------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------- | ------------------------------------------- |
| Diagrama de Casos de Uso (2.1)                           | Comportamental | Quem são os atores e o que cada um pode fazer no sistema?                       | `RF-01` a `RF-14`, `RF-02`                  |
| Diagrama de Sequência: Cadastro, Login e Perfil (2.2) OK | Comportamental | Como o usuário se cadastra, se autentica e acessa rotas protegidas por JWT?     | `RF-01`, `RF-02`, `RNF-03`                  |
| Diagrama de Sequência: Publicação de Anúncio (2.3) OK     | Comportamental | Como um anúncio é publicado e onde a regra de dados sensíveis é aplicada?       | `RF-07`, `RF-08`, `RN-04`, `US-01`          |
| Diagrama de Classes: camada de serviços (3.3) OK         | Estrutural     | Como controller, service, corrente de validação e erro de negócio de anúncios dependem entre si? | `RF-07`, `RF-08`, `RN-02`, `RN-04`          |
| Diagrama de Classes UML (3.1) OK                         | Estrutural     | Quais atributos, tipos e métodos cada classe do modelo tem, e como se associam? | `RF-01`, `RF-04`, `RF-07`, `RF-08`, `RF-10` |
| Diagrama Entidade-Relacionamento (3.2) OK                | Estrutural     | Como Usuário, Anúncio, Foto e Comentário se relacionam no banco?                | `RF-01`, `RF-04`, `RF-07`, `RF-08`, `RF-10` |

## 2. Modelos comportamentais

### 2.1 Diagrama de Casos de Uso

O Mermaid não possui notação nativa de casos de uso; o diagrama usa `flowchart` com os atores à esquerda e os casos de uso em elipses. As setas tracejadas `«include»` indicam que um caso de uso depende de outro.

```mermaid
flowchart LR
    V([Visitante])
    M([Membro da Comunidade UFLA])
    A([Administrador Geral])

    subgraph Radar["Sistema Radar UFLA"]
        UC01((Consultar vitrine<br/>Achados e Perdidos))
        UC02((Filtrar e pesquisar<br/>pertences))
        UC03((Cadastrar-se))
        UC04((Autenticar-se))
        UC05((Publicar anúncio))
        UC06((Enviar fotos))
        UC07((Gerenciar meus anúncios<br/>editar / marcar como resolvido))
        UC08((Comentar em anúncio))
        UC09((Denunciar anúncio))
        UC10((Moderar denúncias))
        UC11((Gerir categorias e locais))
    end

    V --> UC01
    V --> UC02
    V --> UC03
    V --> UC04

    M --> UC01
    M --> UC02
    M --> UC05
    M --> UC07
    M --> UC08
    M --> UC09

    A --> UC10
    A --> UC11
    A --> UC07

    UC05 -. include .-> UC04
    UC07 -. include .-> UC04
    UC08 -. include .-> UC04
    UC09 -. include .-> UC04
    UC05 -. extend .-> UC06
```

**Descrição e decisões representadas:**

- **Atores** (definidos em `requisitos.md`, seção 2): _Visitante_ (somente leitura e busca), _Membro da Comunidade UFLA_ (autenticado; publica, gerencia os próprios anúncios e comenta) e _Administrador Geral_ (modera e parametriza o sistema).
- Todo caso de uso que altera dados (`Publicar`, `Gerenciar`, `Comentar`, `Denunciar`) **inclui** a autenticação. É essa dependência que justifica o middleware JWT no back-end (ver 2.2).
- `Enviar fotos` é uma **extensão** opcional de `Publicar anúncio`: o anúncio pode existir sem foto, e para a categoria "Documentos pessoais" a foto é proibida (regra `RN-04`, detalhada em 2.3).
- O Administrador também acessa `Gerenciar meus anúncios` porque a `RN-02` permite que o criador **ou** o administrador editem ou encerrem um anúncio.
- O ator "Membro" é especialização do "Visitante": herda tudo que o visitante faz (consultar e pesquisar) e acrescenta as ações autenticadas.

| Caso de uso                     | Requisito        | Situação                                                            |
| ------------------------------- | ---------------- | ------------------------------------------------------------------- |
| Consultar vitrine               | `RF-04`          | OK Layout estático em `index.html`/`app.js`; ainda sem dados da API |
| Filtrar e pesquisar             | `RF-05`, `RF-06` | WAR Issue #8                                                         |
| Cadastrar-se / Autenticar-se    | `RF-01`          | OK Issue #4                                                         |
| Publicar anúncio / Enviar fotos | `RF-07`, `RF-08` | WAR Issues #6, #7, #10, #11                                          |
| Gerenciar meus anúncios         | `RF-03`, `RF-09` | WAR Issue #11                                                        |
| Comentar em anúncio             | `RF-10`          | WAR (modelo de dados pronto)                                         |
| Denunciar / Moderar             | `RF-12`          | WAR Issue #14                                                        |
| Gerir categorias e locais       | `RF-11`          | WAR Issue #9                                                         |

### 2.2 Diagrama de Sequência: Cadastro, Login e Perfil (OK implementado)

```mermaid
sequenceDiagram
    actor U as Usuário
    participant F as Front-End (app.js)
    participant R as authRoutes
    participant C as authController
    participant MW as authMiddleware
    participant DB as MySQL (usuarios)

    Note over U,DB: Cadastro (POST /api/auth/registro)
    U->>F: Preenche nome, e-mail e senha
    F->>R: POST /api/auth/registro
    R->>C: registrar(req, res)
    alt nome, e-mail ou senha ausentes
        C-->>F: 400 Nome, e-mail e senha são obrigatórios
    else dados completos
        C->>DB: findOne(email)
        alt e-mail já existe
            C-->>F: 400 E-mail já cadastrado
        else e-mail livre
            C->>C: bcrypt.hash(senha, 10)
            C->>DB: create(nome, email, senha_hash)
            C-->>F: 201 Usuário cadastrado sem senha_hash
        end
    end

    Note over U,DB: Login (POST /api/auth/login)
    U->>F: Informa e-mail e senha
    F->>R: POST /api/auth/login
    R->>C: login(req, res)
    C->>DB: findOne(email)
    C->>C: bcrypt.compare(senha, senha_hash)
    alt usuário inexistente ou senha inválida
        C-->>F: 401 Credenciais inválidas
    else credenciais válidas
        C->>C: jwt.sign(id, email, tipo_usuario) expira em 24h
        C-->>F: 200 token e dados do usuário
        F->>F: localStorage.setItem token
    end

    Note over U,DB: Rota protegida (GET /api/auth/perfil)
    F->>R: GET /api/auth/perfil com Authorization Bearer token
    R->>MW: autenticarToken
    alt token ausente, mal formatado, inválido ou expirado
        MW-->>F: 401 Token inválido ou expirado
    else token válido
        MW->>C: perfil com req.usuarioId
        C->>DB: findByPk sem senha_hash e sem tokens de reset
        C-->>F: 200 dados do perfil
    end
```

**Descrição e decisões representadas:**

- **Senha nunca trafega nem é armazenada em claro:** o hash `bcrypt` (custo 10) é gerado no servidor antes de gravar, e as respostas de cadastro e perfil omitem `senha_hash`, `reset_password_token` e `reset_password_expires` (`RF-01`, `RNF-03`).
- **Mensagem de erro única no login** ("Credenciais inválidas") tanto para e-mail inexistente quanto para senha errada, para não revelar quais e-mails estão cadastrados.
- **Autenticação sem estado (stateless):** o servidor emite um JWT de 24 horas e não guarda sessão; o Front-End guarda o token em `localStorage` e o envia no cabeçalho `Authorization: Bearer`. O `authMiddleware` valida o token e injeta `req.usuarioId` e `req.usuarioTipo` para as rotas seguintes, o que prepara o controle por papéis (`RF-02`).
- Esse mesmo middleware será reutilizado nas rotas de anúncios (2.3).

### 2.3 Diagrama de Sequência: Publicação de Anúncio com validação de RN-04 (OK implementado)

Fluxo de `US-01` implementado na Sprint 4 (Issues #24 e #25), já com a camada de serviços (ADR-01 e ADR-03 de [`decisoes-de-projeto.md`](../projeto/decisoes-de-projeto.md)). O front-end ainda não envia o formulário para esta rota (Issue #11), e as fotos chegam como URLs, pois o upload de arquivos ainda não existe (Issue #10).

```mermaid
sequenceDiagram
    actor M as Membro da Comunidade
    participant F as Front-End (publicar.html)
    participant MW as authMiddleware
    participant C as anuncioController
    participant S as AnuncioService
    participant DB as MySQL

    M->>F: Preenche tipo, título, categoria, local e descrição
    opt anexa fotos
        M->>F: Informa até 3 imagens
    end
    F->>MW: POST /api/anuncios com Bearer token
    alt token inválido ou ausente
        MW-->>F: 401 Não autenticado
    else token válido
        MW->>C: criar(req) com req.usuarioId
        C->>S: criar(req.body, usuarioId)
        alt campo obrigatório ausente, tipo ou categoria inválidos
            S-->>C: RegraNegocioError VALIDACAO
            C-->>F: 400 Campos ou categoria inválidos
        else categoria é documento e há fotos
            S-->>C: RegraNegocioError LGPD
            C-->>F: 400 Não é permitido enviar foto de documento (RN-04)
        else mais de 3 fotos ou formato fora de JPG PNG WEBP
            S-->>C: RegraNegocioError VALIDACAO
            C-->>F: 400 Foto inválida (RF-08)
        else dados válidos
            S->>DB: transação: insert anuncio (ATIVO) + foto_anuncio
            S-->>C: anúncio criado
            C-->>F: 201 Anúncio criado
            F-->>M: Exibe confirmação e dicas de segurança para entrega presencial
        end
    end

    Note over F,DB: Leitura pública (GET /api/anuncios), sem token
    F->>C: listar(tipo)
    C->>S: listar(tipo)
    S->>DB: select anuncio ATIVO com fotos e autor (id, nome)
    C-->>F: 200 sem e-mail nem telefone do autor (RN-04)
```

**Descrição e decisões representadas:**

- **Onde a `RN-04` (LGPD) é aplicada:** em dois pontos do fluxo, ambos no `AnuncioService`. (1) _Na entrada:_ o `RegraLGPDHandler` (até a Sprint 4, a função `validarRegraLGPD`), um dos elos da corrente de validação do ADR-04, rejeita foto quando a categoria é `documento`, na criação e também na edição (`PUT /api/anuncios/:id`), porque olha o estado final do anúncio. (2) _Na saída:_ a listagem pública devolve apenas os campos do anúncio, as fotos e o `id` e `nome` do autor, nunca e-mail ou telefone. A combinação evita depender de análise de imagem, que está fora do escopo (`requisitos.md`, seção 7).
- **Status HTTP:** a `RN-04` responde **400**, conforme o critério de aceitação da Issue #25. Na Sprint 3 este diagrama previa 422; a mudança ficou restrita ao mapeamento de códigos do controller (commit `593156b`).
- **Ordem das validações:** autenticação → campos obrigatórios → tipo e status → categoria (normalizada e conferida contra `objeto, eletronico, documento, material, outro`) → regra `RN-04` → regras de foto (`RF-08`: até 3, JPG/PNG/WEBP) → persistência. O limite de 5 MB só poderá ser validado quando o upload real existir (Issue #10).
- **Persistência:** o anúncio nasce com `status = ATIVO` (critério de aceitação 1 de `US-01`). Anúncio e fotos são gravados na mesma transação, então uma falha não deixa anúncio sem as fotos informadas.
- **Decisão sobre fotos de documentos:** o grupo confirmou a abordagem de **proibir** a foto na categoria `documento` (ADR-03). O campo `contem_dado_sensivel`, comentado no model `FotoAnuncio`, não é necessário.

## 3. Modelos estruturais: Diagrama de Classes UML e Diagrama Entidade-Relacionamento

### 3.1 Diagrama de Classes UML

```mermaid
classDiagram
    class Usuario {
        +int id
        +string nome
        +string email
        -string senha_hash
        -string reset_password_token
        -datetime reset_password_expires
        +hasMany(Anuncio) associate()
        +hasMany(Comentario) associate()
    }
    class Anuncio {
        +int id
        +int usuario_id
        +string titulo
        +string descricao
        +string tipo
        +string categoria
        +string local_encontro
        +string status
        +belongsTo(Usuario) associate()
        +hasMany(FotoAnuncio) associate()
        +hasMany(Comentario) associate()
    }
    class FotoAnuncio {
        +int id
        +int anuncio_id
        +string url_imagem
        +belongsTo(Anuncio) associate()
    }
    class Comentario {
        +int id
        +int anuncio_id
        +int usuario_id
        +string conteudo
        +belongsTo(Anuncio) associate()
        +belongsTo(Usuario) associate()
    }

    Usuario "1" --> "0..*" Anuncio : cria
    Usuario "1" --> "0..*" Comentario : escreve
    Anuncio "1" --> "0..*" FotoAnuncio : possui
    Anuncio "1" --> "0..*" Comentario : recebe
```

O Diagrama de Classes espelha os models Sequelize em `API/Back-End/src/models/`: os atributos privados (`-`) são os campos que nunca aparecem nas respostas da API (seção 2.2), e os métodos `associate()` correspondem às declarações `hasMany`/`belongsTo` de cada arquivo. As cardinalidades e as classes são as mesmas do Diagrama Entidade-Relacionamento (3.2), que detalha a estrutura física das tabelas.

### 3.2 Diagrama Entidade-Relacionamento

```mermaid
erDiagram
    USUARIOS ||--o{ ANUNCIO : cria
    USUARIOS ||--o{ COMENTARIO : escreve
    ANUNCIO ||--o{ FOTO_ANUNCIO : possui
    ANUNCIO ||--o{ COMENTARIO : recebe

    USUARIOS {
        int id PK
        string nome
        string email UK
        string senha_hash
        string reset_password_token
        datetime reset_password_expires
        datetime created_at
        datetime updated_at
    }
    ANUNCIO {
        int id PK
        int usuario_id FK
        string titulo
        text descricao
        enum tipo "ACHADO, PERDIDO"
        string categoria
        string local_encontro
        enum status "ATIVO, RESOLVIDO, ARQUIVADO"
        datetime criado_em
        datetime atualizado_em
    }
    FOTO_ANUNCIO {
        int id PK
        int anuncio_id FK
        string url_imagem
        datetime criado_em
    }
    COMENTARIO {
        int id PK
        int anuncio_id FK
        int usuario_id FK
        text conteudo
        datetime criado_em
    }
```

**Descrição e decisões representadas:**

- **Entidades:** _Usuário_ (quem publica e comenta), _Anúncio_ (o item achado ou perdido), _FotoAnuncio_ (evidência visual do item) e _Comentário_ (interação pública para combinar a devolução, `RF-10`).
- **Relacionamentos (todos 1:N):** um usuário cria muitos anúncios e escreve muitos comentários; um anúncio possui muitas fotos e recebe muitos comentários. Todas as chaves estrangeiras usam `ON DELETE CASCADE`: excluir um anúncio remove suas fotos e comentários, e excluir um usuário remove seus anúncios e comentários.
- **Um único tipo de anúncio:** "Achado" e "Perdido" são o mesmo conceito com o atributo `tipo`, o que permite alternar as abas da vitrine (`RF-04`) com a mesma consulta e o mesmo formulário (`RF-07`).
- **Ciclo de vida:** `status` inicia em `ATIVO` e evolui para `RESOLVIDO` (`RF-09`) ou `ARQUIVADO`. Os índices `idx_anuncio_tipo_status` e `idx_anuncio_usuario_id` sustentam a consulta da vitrine e da área "Meus anúncios" (`RF-03`).
- **Segurança de dados:** `senha_hash` guarda apenas o hash bcrypt (`RNF-03`), e `email` é único (`UK`), condição usada na verificação de duplicidade do cadastro.

### 3.3 Diagrama de Classes: camada de serviços de anúncios

Adicionado na Sprint 4 para representar a decisão ADR-01 e **atualizado na Sprint 5** com a corrente de validação do ADR-04 (padrão Chain of Responsibility, detalhado em [`padroes-de-projeto.md`](../padroes/padroes-de-projeto.md)). Setas tracejadas indicam dependência (quem usa quem); a seta com triângulo indica herança.

```mermaid
classDiagram
    class anuncioRoutes {
        +GET listar()
        +GET buscarPorId()
        +POST criar() com JWT
        +PUT atualizar() com JWT
        +DELETE excluir() com JWT
    }
    class anuncioController {
        -STATUS_POR_CODIGO
        +listar(req, res)
        +buscarPorId(req, res)
        +criar(req, res)
        +atualizar(req, res)
        +excluir(req, res)
    }
    class AnuncioService {
        +listar(filtros)
        +buscarPorId(id)
        +criar(dados, usuarioId)
        +atualizar(id, dados, usuarioId)
        +excluir(id, usuarioId)
        -buscarAnuncioDoAutor(id, usuarioId)
    }
    class AnuncioValidationChain {
        +paraCriacao() ValidationHandler
        +paraEdicao() ValidationHandler
    }
    class ValidationHandler {
        <<abstract>>
        -ValidationHandler proximo
        +setProximo(handler) ValidationHandler
        +validar(contexto) void
        #verificar(contexto)*
    }
    class CamposObrigatoriosHandler {
        #verificar(contexto)
    }
    class CategoriaEStatusHandler {
        #verificar(contexto)
    }
    class RegraLGPDHandler {
        #verificar(contexto)
    }
    class FotosHandler {
        #verificar(contexto)
    }
    class RegraNegocioError {
        +string codigo
        +VALIDACAO
        +LGPD
        +PROIBIDO
        +NAO_ENCONTRADO
    }
    class authMiddleware {
        +autenticarToken(req, res, next)
    }

    anuncioRoutes ..> authMiddleware : protege escrita
    anuncioRoutes ..> anuncioController : delega
    anuncioController ..> AnuncioService : chama
    anuncioController ..> RegraNegocioError : traduz em status HTTP
    AnuncioService ..> AnuncioValidationChain : pede a corrente
    AnuncioValidationChain ..> ValidationHandler : monta
    ValidationHandler <|-- CamposObrigatoriosHandler
    ValidationHandler <|-- CategoriaEStatusHandler
    ValidationHandler <|-- RegraLGPDHandler
    ValidationHandler <|-- FotosHandler
    ValidationHandler o-- ValidationHandler : proximo
    ValidationHandler ..> RegraNegocioError : lança
    AnuncioService ..> RegraNegocioError : lança
    AnuncioService ..> Anuncio : persiste
    AnuncioService ..> FotoAnuncio : persiste
    AnuncioService ..> Usuario : lê id e nome
```

- O controller não depende de nenhum model: só do service e do erro de negócio. O service não depende do Express.
- Na Sprint 4, as validações eram funções internas do `AnuncioService` (`validarCamposObrigatorios`, `validarCategoria`, `validarRegraLGPD`, `validarFotos`). Na Sprint 5 elas passaram a ser handlers em `services/validations/`, encadeados pelo `AnuncioValidationChain`: **criação** = obrigatórios → categoria e status → `RN-04` → fotos; **edição** = categoria e status → `RN-04` → fotos. O `AnuncioService` só continua com a regra de autoria (`buscarAnuncioDoAutor`, `RN-02`), que depende de consultar o banco.
- A ordem da corrente segue o diagrama de sequência 2.3; o `CategoriaEStatusHandler` vem antes do `RegraLGPDHandler` porque normaliza a categoria.

Código: [`anuncioRoutes.js`](../../API/Back-End/src/routes/anuncioRoutes.js), [`anuncioController.js`](../../API/Back-End/src/controllers/anuncioController.js), [`AnuncioService.js`](../../API/Back-End/src/services/AnuncioService.js), [`services/validations/`](../../API/Back-End/src/services/validations/), [`RegraNegocioError.js`](../../API/Back-End/src/services/RegraNegocioError.js).

## 4. Relação entre requisitos e modelos

| Requisito  | Descrição Sintética                           | Issue GitHub                    | Diagrama UML Associado        | Artefato / Código-Fonte Correspondente                                                                                                                    |
| :--------- | :-------------------------------------------- | :------------------------------ | :---------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RF-01**  | Autenticação Local e Cadastro (JWT / Bcrypt)  | `#4`              | Casos de Uso / Sequência      | `API/Back-End/src/controllers/authController.js`<br>`API/Back-End/src/middlewares/authMiddleware.js`<br>`API/Back-End/src/migrations/*create-usuarios.js` |
| **RF-02**  | Controle de Acesso Baseado em Papéis (RBAC)   | `#4`                   | Casos de Uso                  | `API/Back-End/src/middlewares/authMiddleware.js`                                                                                                          |
| **RF-04**  | Vitrine Pública de Achados e Perdidos         | `#5`                  | Casos de Uso / ER             | `API/Front-End/index.html`<br>`API/Front-End/app.js`                                                                                                      |
| **RF-07**  | Cadastrar Novo Anúncio                        | `#6`, `#7`, `#11` | Casos de Uso / Sequência / ER / Classes (3.3) | `API/Front-End/publicar.html`<br>`API/Back-End/src/routes/anuncioRoutes.js`<br>`API/Back-End/src/controllers/anuncioController.js`<br>`API/Back-End/src/services/AnuncioService.js`<br>`API/Back-End/src/models/anuncio.js`<br>`API/Back-End/src/migrations/*create-anuncios.js` |
| **RF-08**  | Upload de Fotos de Anúncios                   | `#10`               | Diagrama ER                   | `API/Back-End/src/models/foto_anuncio.js`<br>`API/Back-End/src/migrations/*create-fotos-anuncio.js`                                                       |
| **RF-10**  | Seção de Comentários no Anúncio               | `#11`                  | Casos de Uso / ER             | `API/Back-End/src/models/comentario.js`<br>`API/Back-End/src/migrations/*create-comentarios.js`                                                           |
| **RN-04**  | Ocultar dados/fotos de "Documentos" (LGPD)    | `#9`                   | Diagrama de Sequência / Classes (3.3) | `API/Back-End/src/services/validations/RegraLGPDHandler.js` (desde a Sprint 5; antes `validarRegraLGPD` no `AnuncioService.js`)<br>`API/Front-End/app.js`<br>`API/Front-End/publicar.html` |
| **RNF-01** | Interface Responsiva e Identidade Visual UFLA | `#5`                            | Casos de Uso                  | `API/Front-End/styles.css`                                                                                                                                |
| **RNF-03** | Segurança e Hash de Senhas (Bcrypt / JWT)     | `#4`              | Diagrama de Sequência         | `API/Back-End/src/controllers/authController.js`                                                                                                          |
| **RNF-06** | Arquitetura Cliente-Servidor e Docker         | `#2`, `#3`                      | Diagrama ER                   | `API/Back-End/docker-compose.yml`<br>`API/Back-End/Dockerfile`                                                                                            |

## 5. Correspondência entre modelo e código

| Elemento modelado                | Arquivo/diretório correspondente                                                                                                                                                                           | Observação                                                          |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Entidade `USUARIOS`              | [`migrations/20260918000000-create-usuarios.js`](../../API/Back-End/src/migrations/20260918000000-create-usuarios.js), [`models/usuario.js`](../../API/Back-End/src/models/usuario.js)                     | Corresponde ao ER; ver divergência do controller na seção 6, item 1 |
| Entidade `ANUNCIO`               | [`migrations/20260918000001-create-anuncios.js`](../../API/Back-End/src/migrations/20260918000001-create-anuncios.js), [`models/anuncio.js`](../../API/Back-End/src/models/anuncio.js)                     | Inclui índices por `usuario_id` e por `tipo, status`                |
| Entidade `FOTO_ANUNCIO`          | [`migrations/20260918000002-create-fotos-anuncio.js`](../../API/Back-End/src/migrations/20260918000002-create-fotos-anuncio.js), [`models/foto_anuncio.js`](../../API/Back-End/src/models/foto_anuncio.js) | `contem_dado_sensivel` está apenas comentado no model               |
| Entidade `COMENTARIO`            | [`migrations/20260918000003-create-comentarios.js`](../../API/Back-End/src/migrations/20260918000003-create-comentarios.js), [`models/comentario.js`](../../API/Back-End/src/models/comentario.js)         | Sem coluna de atualização (`updatedAt: false`)                      |
| Associações 1:N do ER            | [`models/index.js`](../../API/Back-End/src/models/index.js) e métodos `associate` de cada model                                                                                                            | `hasMany`/`belongsTo` espelham os relacionamentos do diagrama       |
| Sequência 2.2 (cadastro e login) | [`controllers/authController.js`](../../API/Back-End/src/controllers/authController.js), [`routes/authRoutes.js`](../../API/Back-End/src/routes/authRoutes.js)                                             | Funções `registrar`, `login` e `perfil`                             |
| Sequência 2.2 (JWT)              | [`middlewares/authMiddleware.js`](../../API/Back-End/src/middlewares/authMiddleware.js)                                                                                                                    | Valida `Bearer`, injeta `req.usuarioId` e `req.usuarioTipo`         |
| Sequência 2.2 (cliente)          | [`API/Front-End/app.js`](../../API/Front-End/app.js), [`login.html`](../../API/Front-End/login.html), [`registro.html`](../../API/Front-End/registro.html)                                                 | `fetch` para `/api/auth/*` e `localStorage.setItem("token")`        |
| Ponto de entrada da API          | [`server.js`](../../API/Back-End/src/server.js)                                                                                                                                                            | Monta `/api/auth` e, desde a Sprint 4, `/api/anuncios`              |
| Sequência 2.3 (publicação)       | [`routes/anuncioRoutes.js`](../../API/Back-End/src/routes/anuncioRoutes.js), [`controllers/anuncioController.js`](../../API/Back-End/src/controllers/anuncioController.js), [`services/AnuncioService.js`](../../API/Back-End/src/services/AnuncioService.js), [`API/Front-End/publicar.html`](../../API/Front-End/publicar.html) | Back-end implementado na Sprint 4; formulário ainda não envia para a API (Issue #11) |
| Casos de uso: vitrine            | [`API/Front-End/index.html`](../../API/Front-End/index.html), [`app.js`](../../API/Front-End/app.js)                                                                                                       | Feed com abas; dados ainda locais                                   |

## 6. Refinamentos identificados

A modelagem revelou lacunas entre requisitos, modelos e código. Cada item deve virar Issue no backlog.

1. **`tipo_usuario` e `telefone` não existem no banco.** O `authController.registrar` lê e devolve esses dois campos, mas a migration e o model de `Usuario` não os possuem; o papel nunca é gravado e o JWT sai com `tipo_usuario` indefinido. Isso bloqueia o `RF-02` (papéis) e a `RN-02`. _Ação:_ nova migration (`tipo_usuario` com valores comum/admin e `telefone` opcional) e atualização do model. O telefone é dado pessoal e, pela `RN-04`, nunca deve aparecer na listagem pública. **Resolvido na Sprint 5:** migration `20261020000000-add-tipo-usuario-telefone-to-usuarios` e model atualizados (commit [`51a576f`](https://github.com/Matheus-Castro-Paula/Radar-UFLA/commit/51a576f)); o cadastro passou a gravar sempre `comum`, sem aceitar `tipo_usuario` do cliente.
2. **Anúncio sem data/hora e com status incompletos.** O `RF-07` exige "Data/Hora" do achado/perda, mas `ANUNCIO` não tem esse campo; e o `status` só aceita `ATIVO`, `RESOLVIDO`, `ARQUIVADO`, enquanto `RN-01` e `RN-03` exigem `EM_QUARENTENA` e `EXPIRADO`. _Ação:_ migration para `data_ocorrencia` e ampliação do enum.
3. **Categoria e local são texto livre.** O `RF-11` pede categorias e locais gerenciados pelo administrador e o `RF-05` filtra por eles. _Ação:_ avaliar entidades `Categoria` e `Local` com chave estrangeira em `ANUNCIO`.
4. **Regra de foto sensível (`RN-04`).** Decisão adotada no diagrama 2.3: proibir foto na categoria "Documentos pessoais". Alternativa (permitir foto com tarja) exigiria o campo `contem_dado_sensivel` e migration. _Ação:_ grupo confirmar a abordagem. **Resolvido na Sprint 4:** o grupo confirmou a proibição da foto (ADR-03 de `decisoes-de-projeto.md`), implementada no `AnuncioService`.
5. **Falta a entidade `Denuncia`** (`RF-12`, `RN-01`): usuário denunciante, anúncio e data, com restrição de uma denúncia por usuário por anúncio para a contagem de 3 denúncias distintas.
6. **Rotas de anúncios inexistentes.** `server.js` só expõe `/api/auth`; `publicar.html` e `index.html` ainda não consomem a API. _Ação:_ implementar o fluxo 2.3 (Issues #6, #7, #10, #11) e ligar a vitrine (Issue #5). **Parcialmente resolvido na Sprint 4:** as rotas `/api/anuncios` existem; falta o front-end consumir a API.
7. **Padronização de nomes de tabela.** `usuarios` está no plural e as demais no singular; registrar como decisão de projeto na Sprint 4 (renomear ou documentar a convenção).
8. **Correção de identificadores.** A versão anterior deste documento usava `RF-001`/`RN-004`/`RNF-001`, fora do padrão de `requisitos.md`, e associava a criptografia de senha ao `RNF-001`; o correto é `RNF-03`. Também citava Issues que não correspondem ao backlog. Tudo foi corrigido nesta versão.

## 7. Histórico de atualização

| Sprint   | Modelo alterado                                                                                                              | Motivo                                                  | Evidência                     |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ----------------------------- |
| Sprint 3 | ER (3): campos `created_at`/`updated_at`/`criado_em`, cardinalidades e `ON DELETE CASCADE` descritos; alinhado às migrations | Garantir correspondência exata entre modelo e código    | ![Usuarios](../sprints/evidencias/sprint-03-instancias-usuarios.jpg)  |
| Sprint 3 | Seções 4 e 5: matriz reescrita com IDs de `requisitos.md`, Issues do backlog e arquivos reais                                | IDs e Issues da versão anterior estavam inconsistentes  | ![Requisitos](../sprints/evidencias/sprint-03-requisitos.png)|
| Sprint 3 | `requisitos.md`: itens de refinamento da seção 6 a registrar (papéis, data/hora, status, `Denuncia`)                         | Modelagem revelou lacunas nos requisitos                |   ![Requisitos6](../sprints/evidencias/sprint-03-requisitos-secao6.png)|
| Sprint 4 | Sequência 2.3: passa de WAR para OK; inclui `AnuncioService`, códigos de `RegraNegocioError` e a `RN-04` com **400** em vez de 422; categoria `documento` | Decisões ADR-01 e ADR-03 e critério de aceitação da Issue #25 | [`decisoes-de-projeto.md`](../projeto/decisoes-de-projeto.md), commits `0bffa9f` e `593156b` |
| Sprint 4 | Novo Diagrama de Classes 3.3 (camada de serviços) | Representar a dependência entre rotas, controller, service e erro de negócio (ADR-01) | [`AnuncioService.js`](../../API/Back-End/src/services/AnuncioService.js) |
| Sprint 4 | Seções 4, 5 e 6: arquivos do módulo de anúncios na matriz; itens 4 e 6 dos refinamentos atualizados | Rotas de anúncios implementadas e decisão da `RN-04` confirmada | Issues #24 e #25 |
| Sprint 5 | Diagrama de Classes 3.3: validações saem do `AnuncioService` e passam a ser a corrente `ValidationHandler` → handlers concretos, montada por `AnuncioValidationChain` | Decisão ADR-04 (padrão Chain of Responsibility) | [`padroes-de-projeto.md`](../padroes/padroes-de-projeto.md), Issues #30, #31 e #32 |
