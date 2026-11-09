# Arquitetura — Radar UFLA

> Sprint 6 — Issue [#40](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/40) | Responsável: Tech Lead (`@BernarDEVthomaz`)

Este documento apresenta a organização global do Radar UFLA: componentes, responsabilidades, comunicação entre as partes, tecnologias, relação com os requisitos não funcionais e forma de execução. As decisões arquiteturais estão registradas como ADR-05 a ADR-08 em [`decisoes-de-projeto.md`](../projeto/decisoes-de-projeto.md).

Nos diagramas, os elementos tracejados ainda não fazem parte da `main`: estão em implementação nas Issues [#41](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/41), [#42](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/42) e [#43](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/43) ou previstos nos requisitos. Os blocos são clicáveis e levam ao código correspondente; os mesmos destinos estão listados na seção 5.

## 1. Estilo arquitetural

O Radar UFLA adota uma arquitetura **cliente-servidor**, com o back-end organizado como um **monólito em camadas**:

- o **cliente** é um conjunto de páginas estáticas (HTML, CSS e JavaScript) executadas no navegador, que consomem a API por `fetch`;
- o **servidor** é uma única API REST em Node.js e Express, implantada como um único processo;
- os **dados** ficam em um banco relacional MySQL, e as fotos dos anúncios, em um volume local.

As alternativas avaliadas e a justificativa estão na ADR-05.

### 1.1 Arquitetura global, decisões locais e padrões

| Nível                    | Pergunta que responde                                  | No Radar UFLA                                                                 | Registro                                                                                          |
| ------------------------ | ------------------------------------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Arquitetura global       | Quais partes existem e como se comunicam?              | Cliente-servidor, monólito em camadas, contêineres e armazenamento de mídia   | Este documento e ADR-05 a ADR-08                                                                  |
| Decisão local de projeto | Como organizar internamente um módulo?                 | Camada de serviços, autenticação com JWT e `RN-04` aplicada no service        | ADR-01 a ADR-03 em [`decisoes-de-projeto.md`](../projeto/decisoes-de-projeto.md)                  |
| Padrão de projeto        | Como resolver um problema recorrente em um trecho?     | Chain of Responsibility nas validações de anúncio                             | ADR-04 e [`padroes-de-projeto.md`](../padroes/padroes-de-projeto.md)                              |

## 2. Diagrama de Contexto

Mostra quem usa o sistema e com quais sistemas externos ele se relaciona.

```mermaid
flowchart TB
    visitante["Visitante<br/>consulta e pesquisa a vitrine pública"]
    comunidade["Comunidade UFLA<br/>publica e gerencia os próprios anúncios"]
    admin["Administrador Geral<br/>moderação e parâmetros do campus"]
    radar["Radar UFLA<br/>aplicação web de achados e perdidos"]
    fontes["Google Fonts<br/>sistema externo, fontes da interface"]

    visitante -->|"navegador, HTTP"| radar
    comunidade -->|"navegador, HTTP com token JWT"| radar
    admin -.->|"previsto: RF-11 e RF-12"| radar
    radar -->|"HTTPS, carregamento das fontes"| fontes

    click visitante href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/main/API/Front-End/index.html" "Vitrine pública" _blank
    click comunidade href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/main/API/Front-End/publicar.html" "Formulário de publicação" _blank
    click admin href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/main/docs/requisitos/requisitos.md#2-atores-e-perfis" "Atores e perfis" _blank
    click radar href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/main/API" "Código da aplicação" _blank
    click fontes href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/main/API/Front-End/index.html" "Referência às fontes" _blank
```

Os três atores são os definidos em [`requisitos.md`](../requisitos/requisitos.md#2-atores-e-perfis). O papel de administrador já existe no cadastro de usuários, mas as telas de moderação e de parâmetros ainda não foram implementadas.

O Google Fonts é a única dependência externa ativa. O MySQL e o armazenamento de fotos são executados pelo próprio projeto, por isso aparecem como contêineres na seção 3, e não como sistemas externos. A ADR-08 registra a decisão de não usar um serviço externo de mídia. O envio de e-mail do `RF-13` ainda não foi implementado.

## 3. Diagrama de Contêineres

Mostra as unidades executáveis do sistema, as tecnologias e os protocolos entre elas.

```mermaid
flowchart TB
    usuario["Usuário<br/>navegador web"]
    fontes["Google Fonts"]

    subgraph maquina["Máquina de execução"]
        front["Front-End estático<br/>HTML, CSS e JavaScript<br/>porta 8000"]

        subgraph compose["Docker Compose"]
            api["API REST monolítica<br/>Node.js 20 e Express 5<br/>serviço backend, porta 3000"]
            banco[("MySQL 8.0<br/>serviço db, porta 3306")]
            dados[("Volume mysql_data")]
            uploads[("Volume /uploads<br/>fotos dos anúncios")]
        end
    end

    usuario -->|"HTTP, baixa as páginas"| front
    front -->|"HTTPS, fontes"| fontes
    front -->|"fetch: REST com JSON e Bearer JWT"| api
    api -->|"Sequelize: SQL parametrizado"| banco
    banco --> dados
    api -.->|"grava e serve as fotos"| uploads

    style uploads stroke-dasharray: 5 5

    click usuario href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/main/docs/requisitos/requisitos.md#2-atores-e-perfis" "Atores e perfis" _blank
    click fontes href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/main/API/Front-End/index.html" "Referência às fontes" _blank
    click front href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/main/API/Front-End" "Código do Front-End" _blank
    click api href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/main/API/Back-End/src" "Código da API" _blank
    click banco href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/main/API/Back-End/docker-compose.yml" "Serviço db" _blank
    click dados href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/main/API/Back-End/docker-compose.yml" "Volume mysql_data" _blank
    click uploads href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/main/API/Back-End/docker-compose.yml" "Configuração dos volumes" _blank
```

O JavaScript do Front-End é executado no navegador, portanto as chamadas `fetch` partem da máquina do usuário. Como o Front-End (porta 8000) e a API (porta 3000) têm origens diferentes, a API habilita CORS em [`server.js`](../../API/Back-End/src/server.js). O Front-End não faz parte do Compose (ADR-07).

## 4. Componentes da API

Detalha o contêiner da API e a separação em camadas.

```mermaid
flowchart TB
    cliente["Front-End ou outro cliente HTTP"]

    subgraph api["API REST, processo único"]
        servidor["server.js<br/>CORS, JSON e montagem das rotas"]
        rotas["Routes<br/>authRoutes e anuncioRoutes"]
        autenticacao["Middlewares<br/>authMiddleware"]
        upload["Middlewares<br/>uploadMiddleware com Multer"]
        controladores["Controllers<br/>authController e anuncioController"]
        servicos["Services<br/>AnuncioService e RegraNegocioError"]
        validacoes["Validations<br/>corrente de handlers, ADR-04"]
        modelos["Models Sequelize<br/>usuario, anuncio, foto_anuncio e comentario"]
        configuracao["Config<br/>config.js e variáveis do .env"]
    end

    banco[("MySQL")]
    arquivos[("Volume /uploads")]

    cliente -->|"HTTP"| servidor
    servidor --> rotas
    rotas -->|"rotas protegidas"| autenticacao
    rotas -->|"rotas públicas"| controladores
    autenticacao --> controladores
    autenticacao -.-> upload
    upload -.-> controladores
    controladores --> servicos
    controladores -->|"somente authController, M-01"| modelos
    servicos --> validacoes
    servicos --> modelos
    servicos -.-> arquivos
    modelos --> banco
    modelos --> configuracao

    style upload stroke-dasharray: 5 5
    style arquivos stroke-dasharray: 5 5

    click cliente href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/main/API/Front-End/app.js" "Cliente da API" _blank
    click servidor href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/main/API/Back-End/src/server.js" "server.js" _blank
    click rotas href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/main/API/Back-End/src/routes" "Rotas" _blank
    click autenticacao href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/main/API/Back-End/src/middlewares/authMiddleware.js" "authMiddleware.js" _blank
    click upload href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/main/API/Back-End/src/middlewares" "Middlewares" _blank
    click controladores href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/main/API/Back-End/src/controllers" "Controllers" _blank
    click servicos href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/main/API/Back-End/src/services" "Services" _blank
    click validacoes href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/main/API/Back-End/src/services/validations" "Validations" _blank
    click modelos href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/main/API/Back-End/src/models" "Models" _blank
    click configuracao href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/main/API/Back-End/src/config/config.js" "config.js" _blank
    click banco href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/main/API/Back-End/src/migrations" "Migrations" _blank
    click arquivos href "https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/main/API/Back-End/docker-compose.yml" "Configuração dos volumes" _blank
```

Cada camada conversa com a camada imediatamente abaixo. A exceção conhecida é o `authController`, que ainda acessa o model `Usuario` diretamente (melhoria M-01). O que cada camada faz e o que não deve fazer está na seção 1 de [`decisoes-de-projeto.md`](../projeto/decisoes-de-projeto.md).

## 5. Responsabilidades e interfaces

### 5.1 Contêineres

| Componente                        | Responsabilidade                                                                                     | Interface                                                                    | Código                                                                                                                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Front-End estático                | Exibir a vitrine e os formulários, aplicar busca e filtros sobre os anúncios carregados e guardar o token no navegador. | Páginas servidas na porta 8000; consome a API por `fetch`.                   | [`API/Front-End/`](../../API/Front-End/)                                                                                                                      |
| API REST                          | Autenticar usuários, aplicar as regras de negócio e validar os dados recebidos.                      | HTTP na porta 3000, conforme a seção 5.3.                                    | [`API/Back-End/src/`](../../API/Back-End/src/)                                                                                                                |
| MySQL                             | Persistir usuários, anúncios, fotos e comentários.                                                   | Protocolo MySQL em `db:3306`, acessado somente pelos models.                 | [`docker-compose.yml`](../../API/Back-End/docker-compose.yml), [`src/models/`](../../API/Back-End/src/models/), [`src/migrations/`](../../API/Back-End/src/migrations/) |
| Volume `mysql_data`               | Manter os dados do banco entre reinícios do contêiner.                                               | Volume nomeado do Docker, montado em `/var/lib/mysql`.                       | [`docker-compose.yml`](../../API/Back-End/docker-compose.yml)                                                                                                 |
| Volume `/uploads` (em implementação) | Guardar os arquivos das fotos dos anúncios.                                                       | Escrita pela API e leitura por HTTP em `/uploads/<arquivo>` (seção 5.4).     | [`docker-compose.yml`](../../API/Back-End/docker-compose.yml)                                                                                                 |
| Google Fonts                      | Fornecer as fontes Fraunces e Inter.                                                                 | CSS carregado pelo navegador por HTTPS.                                      | [`index.html`](../../API/Front-End/index.html)                                                                                                                |

### 5.2 Camadas da API

| Origem      | Destino     | Interface                                                                                                  | Código                                                                                                                                                 |
| ----------- | ----------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Cliente     | `server.js` | Requisições HTTP; CORS e leitura de JSON são aplicados globalmente.                                        | [`app.js`](../../API/Front-End/app.js), [`server.js`](../../API/Back-End/src/server.js)                                                                |
| `server.js` | Routes      | Prefixos `/api/auth` e `/api/anuncios`.                                                                    | [`routes/`](../../API/Back-End/src/routes/)                                                                                                            |
| Routes      | Middlewares | Função Express `(req, res, next)` aplicada às rotas protegidas.                                            | [`anuncioRoutes.js`](../../API/Back-End/src/routes/anuncioRoutes.js), [`middlewares/`](../../API/Back-End/src/middlewares/)                            |
| Middlewares | Controllers | `req.usuarioId` e `req.usuarioTipo`, extraídos do JWT.                                                     | [`authMiddleware.js`](../../API/Back-End/src/middlewares/authMiddleware.js), [`controllers/`](../../API/Back-End/src/controllers/)                     |
| Controllers | Services    | Métodos como `AnuncioService.criar(dados, usuarioId)`; falhas de regra chegam como `RegraNegocioError`.    | [`services/`](../../API/Back-End/src/services/)                                                                                                        |
| Services    | Validations | `anuncioValidationChain.executar(dados, { acao })`.                                                        | [`services/validations/`](../../API/Back-End/src/services/validations/)                                                                                |
| Services    | Models      | Consultas e transações do Sequelize.                                                                       | [`AnuncioService.js`](../../API/Back-End/src/services/AnuncioService.js), [`models/`](../../API/Back-End/src/models/)                                  |
| Models      | MySQL       | Sequelize com o driver `mysql2`, configurado por `config.js` e pelas variáveis do `.env`.                  | [`models/index.js`](../../API/Back-End/src/models/index.js), [`config.js`](../../API/Back-End/src/config/config.js), [`.env.example`](../../API/Back-End/.env.example) |

### 5.3 Convenções da API REST

| Aspecto               | Convenção                                                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Rotas                 | `/api/auth/*` e `/api/anuncios`, listadas na [seção 11 do README](../../README.md#11-endpoints-da-api).                                                                                     |
| Formato               | JSON. A criação de anúncio passa a usar `multipart/form-data` com a Issue [#41](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/41) (seção 5.4).                                   |
| Autenticação          | Cabeçalho `Authorization: Bearer <token>`, com JWT válido por 24 horas (ADR-02).                                                                                                           |
| Leitura pública       | `GET /api/anuncios` e `GET /api/anuncios/:id` não exigem token e expõem do autor apenas `id` e `nome` (`RN-04`).                                                                            |
| Falha de autenticação | `401` quando o token está ausente, tem formato inválido ou expirou.                                                                                                                        |
| Erros de regra        | `VALIDACAO` e `LGPD` respondem `400`, `PROIBIDO` responde `403` e `NAO_ENCONTRADO` responde `404`.                                                                                         |
| Erros inesperados     | `500`. A remoção de `details` dessas respostas está na Issue [#41](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/41) (melhoria M-06).                                            |

### 5.4 Contrato do upload de fotos

Contrato definido nesta sprint para integrar as Issues [#41](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/41), [#42](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/42) e [#43](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/43), conforme a ADR-08. Até a conclusão dessas Issues, as fotos continuam representadas como lista de URLs.

| Etapa              | Contrato                                                                                                                                                                                             | Issue                                                                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Envio              | O Front-End envia `POST /api/anuncios` em `multipart/form-data`, com os campos de texto atuais, `data_ocorrencia` e até 3 arquivos no campo `fotos`.                                                  | [#43](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/43)                                                                                |
| Recebimento        | O `uploadMiddleware` usa Multer em memória (`memoryStorage`), com limite de 5 MB por arquivo e 3 arquivos por requisição.                                                                             | [#41](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/41)                                                                                |
| Entrada no service | O controller repassa `req.files` em `dados.fotos`. O `PUT` continua em JSON, com a lista de caminhos já salvos.                                                                                       | [#41](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/41)                                                                                |
| Validação          | O `FotosHandler` confere quantidade, tamanho e MIME dos arquivos novos e a extensão dos caminhos já salvos. O `RegraLGPDHandler` continua lendo `dados.fotos`, portanto a `RN-04` vale sem alteração. | [#41](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/41)                                                                                |
| Gravação           | Depois da aprovação da corrente, o `AnuncioService` grava os arquivos em `/uploads` com nome gerado e salva o caminho relativo em `foto_anuncio.url_imagem`. Se a transação falhar, remove os arquivos gravados. | [#41](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/41), [#42](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/42)           |
| Leitura            | O Express serve a pasta em `/uploads`. O Front-End monta o endereço com a origem da API, sem o sufixo `/api`, e usa um placeholder quando não há foto.                                                | [#41](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/41), [#43](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/43)           |
| Data da ocorrência | A coluna `data_ocorrencia` é gravada pelo `AnuncioService` em `criar` e incluída nos campos editáveis de `atualizar`.                                                                                 | [#41](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/41), [#42](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/42)           |

## 6. Tecnologias

A stack foi definida como restrição do projeto na Sprint 1 ([`visao-geral.md`](../visao-geral.md#5-restrições-e-premissas), seção 5). A tabela relaciona cada tecnologia à necessidade que ela atende nesta arquitetura.

| Tecnologia                     | Papel na arquitetura                          | Justificativa                                                                                                                                                       |
| ------------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node.js 20                     | Ambiente de execução da API                   | A API passa a maior parte do tempo aguardando banco e arquivos, perfil adequado ao modelo de I/O assíncrono. A mesma linguagem do Front-End facilita a atuação da equipe nas duas partes. |
| Express 5                      | Servidor HTTP e cadeia de middlewares         | O modelo de middlewares corresponde à separação adotada: autenticação e upload ficam antes do controller, sem se misturar às regras de negócio.                      |
| Sequelize 6 e `mysql2`         | Acesso a dados, associações e migrations      | Consultas parametrizadas reduzem o risco de injeção de SQL (`RNF-03`), transações garantem a gravação conjunta de anúncio e fotos, e migrations versionam o esquema (ADR-06). |
| MySQL 8.0                      | Banco de dados relacional                     | Usuários, anúncios, fotos e comentários formam relacionamentos 1:N com integridade referencial, conforme o `RNF-06`.                                                 |
| `jsonwebtoken` e `bcryptjs`    | Autenticação e armazenamento de senhas        | Token sem estado no servidor, adequado a um cliente separado da API, e senhas guardadas apenas em hash (ADR-02 e `RNF-03`).                                          |
| Multer (em implementação)      | Recebimento de `multipart/form-data`          | Integra-se ao Express como middleware e limita tamanho e quantidade de arquivos antes do controller (`RF-08` e ADR-08).                                              |
| Docker e Docker Compose        | Empacotamento e execução da API e do banco    | Mesma versão de Node.js e MySQL em todas as máquinas e isolamento dos serviços (`RNF-06` e ADR-07).                                                                  |
| HTML, CSS e JavaScript         | Interface do usuário                          | Páginas estáticas dispensam etapa de build e evitam o carregamento de um framework no navegador (`RNF-02`).                                                          |

## 7. Requisitos não funcionais e decisões arquiteturais

A coluna **Situação** indica o que pode ser verificado na `main` nesta sprint. O que ainda não é atendido gera as melhorias listadas na seção 9.

| Requisito                             | Decisões arquiteturais                                                                                                                                                                                       | Evidência                                                                                                                                                                                                                                                                                  | Situação                                                                                                                                                                                                                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RNF-01` Usabilidade                  | Interface separada da API, com CSS próprio.                                                                                                                                                                  | [`styles.css`](../../API/Front-End/styles.css), com ponto de quebra em 720 px.                                                                                                                                                                                                             | **Parcial.** O layout é responsivo, mas o CSS parte do desktop, e não de mobile-first.                                                                                                                                                                                    |
| `RNF-02` Desempenho                   | Busca e filtros aplicados no navegador sobre a lista já carregada; índice por `tipo` e `status`; Front-End sem framework.                                                                                    | Função `render` em [`app.js`](../../API/Front-End/app.js) e `idx_anuncio_tipo_status` em [`create-anuncios`](../../API/Back-End/src/migrations/20260918000001-create-anuncios.js).                                                                                                          | **Não medido.** As metas de 800 ms e 2 s serão verificadas na Sprint 7. A listagem ainda não é paginada (M-12).                                                                                                                                                           |
| `RNF-03` Segurança                    | Senhas com bcrypt e JWT sem estado (ADR-02); SQL parametrizado (ADR-06); `RN-04` validada na API e vitrine sem dados pessoais (ADR-03); token em cabeçalho, sem cookie; conteúdo escapado no Front-End.       | [`authController.js`](../../API/Back-End/src/controllers/authController.js), [`RegraLGPDHandler.js`](../../API/Back-End/src/services/validations/RegraLGPDHandler.js), `INCLUDE_PUBLICO` em [`AnuncioService.js`](../../API/Back-End/src/services/AnuncioService.js) e `escapeHTML` em [`app.js`](../../API/Front-End/app.js). | **Parcial.** A API responde em HTTP, sem TLS (M-08), e o CORS aceita qualquer origem (M-10). A chave JWT fixa e os detalhes de erro estão na Issue [#41](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/41) (M-02 e M-06).                                       |
| `RNF-04` Auditoria e Confiabilidade   | Transações do Sequelize na gravação de anúncios e reinício automático dos contêineres.                                                                                                                        | `sequelize.transaction` em [`AnuncioService.js`](../../API/Back-End/src/services/AnuncioService.js) e `restart: always` em [`docker-compose.yml`](../../API/Back-End/docker-compose.yml).                                                                                                   | **Não atendido.** Não há log de auditoria (M-09), e a instância única não sustenta a meta de 99,5%, que também não é medida.                                                                                                                                              |
| `RNF-05` Acessibilidade               | Atributos ARIA nos componentes dinâmicos da interface.                                                                                                                                                       | `role="tablist"`, `aria-selected` e `aria-live` em [`index.html`](../../API/Front-End/index.html).                                                                                                                                                                                          | **Parcial.** A conformidade com a WCAG 2.1 AA ainda não foi validada com Axe ou WAVE.                                                                                                                                                                                     |
| `RNF-06` Arquitetura                  | Cliente-servidor com monólito em camadas (ADR-05), banco relacional (ADR-06), serviços isolados no Docker (ADR-07) e fotos em volume local (ADR-08).                                                          | Seções 3 e 4 deste documento e [`docker-compose.yml`](../../API/Back-End/docker-compose.yml).                                                                                                                                                                                               | **Atendido** quanto a cliente-servidor, modularidade e banco relacional. O armazenamento de mídias depende das Issues [#41](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/41) e [#42](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/42).          |

## 8. Implantação e execução

Esta seção descreve o ambiente usado no desenvolvimento e na demonstração. O passo a passo completo está na [seção 10 do README](../../README.md#10-execução-da-aplicação).

| Unidade     | Origem                                                                                      | Porta | Persistência                                  | Configuração                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------- | ----- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `db`        | Imagem `mysql:8.0`                                                                          | 3306  | Volume `mysql_data`                           | Variáveis `MYSQL_ROOT_PASSWORD` e `MYSQL_DATABASE` no [`docker-compose.yml`](../../API/Back-End/docker-compose.yml) |
| `backend`   | [`Dockerfile`](../../API/Back-End/Dockerfile) com `node:20-alpine`                          | 3000  | Código de `API/Back-End` montado em `/app`    | Arquivo `.env`, a partir de [`.env.example`](../../API/Back-End/.env.example)                                 |
| Front-End   | Arquivos de [`API/Front-End`](../../API/Front-End/), servidos fora do Compose com `python -m http.server` | 8000  | Não se aplica                                 | Constante `API_BASE` em [`app.js`](../../API/Front-End/app.js)                                                |

Ordem de inicialização na versão atual:

1. Copiar `.env.example` para `.env` e preencher as variáveis.
2. Executar `docker compose up --build` em `API/Back-End`, o que sobe os serviços `db` e `backend`.
3. Aplicar migrations e seeder com `docker compose exec backend npx sequelize-cli`.
4. Servir o Front-End na porta 8000 e acessar `http://localhost:8000`.

A Issue [#42](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/42) adiciona o volume persistente `/uploads` e a execução automática de migrations e seeders, o que elimina o passo 3.

Limites deste ambiente:

- a API responde em HTTP e há uma única instância de cada serviço, o que atende à demonstração acadêmica, mas não a um ambiente de produção;
- o Compose define a senha do banco em texto e expõe a porta do MySQL na máquina (M-11);
- até esta sprint, não há versão publicada da aplicação.

## 9. Débitos e ajustes arquiteturais

Identificados ao confrontar esta arquitetura com o código. Motivos e prioridades estão na seção 4 de [`decisoes-de-projeto.md`](../projeto/decisoes-de-projeto.md).

| ID   | Ajuste                                                                 | Situação                                                                                     |
| ---- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| M-01 | Extrair um `AuthService`, para o `authController` deixar de acessar models | A fazer                                                                                      |
| M-02 | Tornar `JWT_SECRET` obrigatório via `.env`, sem valor padrão           | Em andamento na Issue [#41](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/41)    |
| M-04 | Validar o limite de 5 MB por arquivo                                   | Em andamento na Issue [#41](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/41)    |
| M-06 | Remover detalhes internos das respostas de erro 500                    | Em andamento na Issue [#41](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/41)    |
| M-08 | Publicar a API com HTTPS/TLS                                           | A fazer                                                                                      |
| M-09 | Registrar log de auditoria                                             | A fazer                                                                                      |
| M-10 | Restringir o CORS e ler a porta do `.env`                              | A fazer                                                                                      |
| M-11 | Retirar a senha do Compose e não expor a porta do MySQL                | A fazer                                                                                      |
| M-12 | Paginar a listagem e levar busca e filtros ao servidor                 | A fazer                                                                                      |
| M-13 | Apagar os arquivos ao excluir ou substituir fotos                      | A fazer                                                                                      |
| M-14 | Conferir a assinatura real dos arquivos enviados                       | A fazer                                                                                      |
