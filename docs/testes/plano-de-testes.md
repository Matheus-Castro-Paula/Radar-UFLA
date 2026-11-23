# Plano de Testes — Radar UFLA

> Sprint 7 — Issue [#52](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/52) | Responsável: Tech Lead (`@BernarDEVthomaz`)
>
> **Atualizado na Sprint 8:** matriz de rastreabilidade e registro de execução com o resultado do CT-12 e as execuções de 22/11/2026 (PRs #66 e [#68](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/68)). O resultado consolidado e a classificação dos requisitos estão em [`evidencias-testes.md`](evidencias-testes.md).

Este documento define o que será testado no Radar UFLA, em quais níveis, com quais casos e com quais critérios de aprovação. Os casos usam a numeração `CT-xx`, que deve aparecer no nome dos testes automatizados, nas evidências e no relatório da sprint, para manter a rastreabilidade.

## 1. Objetivos

- verificar se a autenticação, o cadastro de anúncios com fotos e a vitrine atendem aos requisitos priorizados;
- confirmar a correção dos defeitos M-15, M-16 e M-18 (Issues [#49](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/49), [#50](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/50) e [#51](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/51));
- evitar regressão nas regras já implementadas: autoria (`RN-02`), LGPD (`RN-04`) e limites de upload (`RF-08`);
- gerar evidência verificável da execução, que será consolidada na Sprint 8 em [`evidencias-testes.md`](evidencias-testes.md).

## 2. Escopo

**Dentro do escopo:** rotas `/api/auth` e `/api/anuncios`, recebimento e leitura de fotos em `/uploads`, regras `RN-02` e `RN-04` e as páginas [`publicar.html`](../../API/Front-End/publicar.html) e [`index.html`](../../API/Front-End/index.html).

**Fora do escopo nesta sprint:**

| Item | Motivo |
| --- | --- |
| `RF-03`, `RF-10` a `RF-14` | Funcionalidades ainda não implementadas |
| `RF-05` e `RF-06` (busca e filtros) | Executados no navegador, sobre a lista já carregada; verificados apenas no roteiro manual da vitrine |
| `RNF-04` (auditoria) | Não há log de auditoria (melhoria M-09) |
| `RNF-05` (acessibilidade) | Validação com Axe e WAVE prevista para a Sprint 8 |
| HTTPS/TLS | A API responde apenas em HTTP (melhoria M-08) |

## 3. Níveis e tipos de teste

| Nível | O que cobre | Ferramenta | Local | Responsável |
| --- | --- | --- | --- | --- |
| Unidade | Handlers da corrente de validação, sem banco e sem HTTP | Jest | `API/Back-End/tests/unit/` | Matheus |
| Integração | Rotas da API com banco de teste e pasta de uploads isolada | Jest e Supertest | `API/Back-End/tests/integration/` | Matheus, com o ambiente de Arthur |
| E2E | Fluxos completos na interface | Roteiro manual com capturas de tela | `docs/testes/evidencias/` | Rodrigo |

| Tipo | Objetivo | Casos |
| --- | --- | --- |
| Funcional | Comportamento esperado dos requisitos | CT-01, CT-03, CT-04, CT-06, CT-10, CT-12 |
| Segurança | Autenticação, autorização, LGPD e entrada maliciosa | CT-02, CT-05, CT-07, CT-08, CT-09, CT-11 |
| Regressão | Reexecução da suíte automatizada (CT-01 a CT-11) a cada PR e após cada merge na `main` | CT-01 a CT-11 |
| Carga | Tempo de resposta da vitrine | CT-13 |

## 4. Ambiente e dados de teste

- **Banco:** a suíte roda com `NODE_ENV=test`, que usa a configuração `test` de [`config.js`](../../API/Back-End/src/config/config.js) e o banco `radar_ufla_test`. O banco é recriado e as migrations são aplicadas do zero a cada execução.
- **Segredo do token:** o ambiente de teste define um `JWT_SECRET` próprio. Sem ele, a API não carrega.
- **Arquivos:** a variável `UPLOADS_DIR`, lida por [`config/upload.js`](../../API/Back-End/src/config/upload.js), aponta para uma pasta temporária, apagada ao fim da suíte.
- **Usuários:** o preparo da suíte cadastra o usuário A (autor) e o usuário B pela própria rota `POST /api/auth/registro`. Fixtures em seeder devem ficar em `src/seeders`, caminho configurado em [`.sequelizerc`](../../API/Back-End/.sequelizerc). Categoria não é tabela, e sim uma lista fixa no código, então não precisa de fixture.
- **Arquivos de teste:** um PNG válido pequeno, um JPEG com mais de 5 MB e um arquivo de texto renomeado para `.png`.

**Pré-requisitos de testabilidade:** o [`server.js`](../../API/Back-End/src/server.js) chama `app.listen(3000)` e não exporta o `app`, mas o Supertest precisa do `app` sem o servidor no ar. É preciso separar a montagem do `app` da chamada a `listen`. O [`package.json`](../../API/Back-End/package.json) também precisa receber Jest, Supertest e um script `test`.

## 5. Funcionalidades críticas e riscos

| ID | Risco | Impacto | Probabilidade | Requisito | Casos |
| --- | --- | --- | --- | --- | --- |
| R-01 | Rota protegida acessível sem token válido | Alto | Média | `RF-01`, `RNF-03` | CT-01, CT-02 |
| R-02 | Upload contornando o Multer, com URL externa enviada em JSON (M-16) | Alto | Alta, defeito aberto | `RF-08`, `RNF-03` | CT-05 |
| R-03 | Perda da data de ocorrência (M-15) | Médio | Alta, defeito aberto | `RF-07` | CT-04, CT-12 |
| R-04 | Foto de documento gravada no servidor | Alto | Baixa | `RN-04` | CT-07, CT-12 |
| R-05 | Arquivo grande, em excesso ou com conteúdo falso aceito | Alto | Baixa | `RF-08`, `RNF-03` | CT-08, CT-09 |
| R-06 | Dados pessoais do autor expostos na vitrine | Alto | Baixa | `RN-04` | CT-10 |
| R-07 | Anúncio alterado ou excluído por quem não é o autor | Alto | Baixa | `RN-02` | CT-11 |
| R-08 | Metadados das fotos não gravados (M-18) | Baixo | Alta, defeito aberto | `RF-08` | CT-06 |
| R-09 | Vitrine lenta | Médio | Baixa | `RNF-02` | CT-13 |
| R-10 | API não sobe em banco anterior à Sprint 6 (M-17) | Médio | Média | — | Fora da suíte, pois o ambiente de teste parte de banco vazio (seção 10) |

## 6. Casos de teste

| ID | Requisito | Pré-condição | Passos | Dados | Resultado esperado |
| --- | --- | --- | --- | --- | --- |
| CT-01 | `RF-01`, `RNF-03` | Usuário A cadastrado | 1. `POST /api/auth/login` com a senha correta<br>2. Repetir com senha errada | E-mail e senha de A; senha `errada123` | 1. `200` com `token`; o JWT decodificado tem `id` e `tipo_usuario = comum` e expira em 24 h<br>2. `401` "Credenciais inválidas." |
| CT-02 | `RF-01`, `RNF-03` | API no ar | 1. `GET /api/auth/perfil` sem `Authorization`<br>2. Com `Bearer abc`<br>3. Com token assinado com `chave_secreta_sprint_3`<br>4. `POST /api/anuncios` sem token | — | 1 a 3. `401`<br>4. `401`, sem anúncio criado |
| CT-03 | `RF-07`, `RF-08` | A autenticado | 1. `POST /api/anuncios` em `multipart/form-data` com os campos e uma foto<br>2. `GET` no caminho devolvido em `url_imagem` | `titulo` "Garrafa azul", `descricao`, `tipo` `ACHADO`, `categoria` `objeto`, `local_encontro` "Bloco 3", PNG válido | 1. `201`; `fotos[0].url_imagem` no formato `/uploads/<uuid>.png`; arquivo presente na pasta de uploads<br>2. `200` com `X-Content-Type-Options: nosniff` |
| CT-04 | `RF-07`, M-15 | A autenticado | 1. `POST /api/anuncios` com `data_ocorrencia`<br>2. `GET /api/anuncios/:id`<br>3. `PUT /api/anuncios/:id` com outra data | `2026-11-09T17:30:00.000Z`; depois `2026-11-10T09:00:00.000Z` | 1 e 2. `data_ocorrencia` igual à enviada<br>3. `200` e a nova data gravada |
| CT-05 | `RF-08`, `RNF-03`, M-16 | A autenticado e anúncio de A sem foto | 1. `POST /api/anuncios` em JSON com `fotos` contendo URL externa<br>2. `PUT /api/anuncios/:id` com URL externa em `fotos` | `["https://exemplo.com/x.png"]` | 1. `400`, sem anúncio nem foto criados<br>2. `400`, anúncio inalterado |
| CT-06 | `RF-08`, M-18 | CT-03 executado | 1. Consultar o registro de `foto_anuncio` criado no CT-03 | PNG do CT-03 | `mime_type = image/png` e `tamanho_bytes` igual ao tamanho do arquivo enviado |
| CT-07 | `RN-04` | A autenticado e anúncio de A com foto | 1. `POST /api/anuncios` com `categoria` `documento` e uma foto<br>2. `PUT` do anúncio com foto mudando `categoria` para `documento` | PNG válido | 1. `400` "Não é permitido enviar foto de documento pessoal (RN-04 / LGPD). Publique apenas a descrição."; nenhum arquivo novo na pasta de uploads<br>2. `400`, anúncio inalterado |
| CT-08 | `RF-08` | A autenticado | 1. Enviar uma foto de 6 MB<br>2. Enviar quatro fotos | JPEG de 6 MB; quatro PNG válidos | 1. `400` "Cada foto deve ter no máximo 5 MB."<br>2. `400` "Envie no máximo 3 fotos."<br>Nenhum anúncio nem arquivo gravado |
| CT-09 | `RF-08`, `RNF-03` | Nenhuma (teste de unidade) | 1. Executar o `FotosHandler` com um arquivo declarado como PNG, mas com conteúdo de texto | `mimetype` `image/png`; conteúdo "texto" | `RegraNegocioError` com código `VALIDACAO` e mensagem "O arquivo enviado não é uma imagem válida." |
| CT-10 | `RN-04` | Anúncio de A cadastrado | 1. `GET /api/anuncios` sem token<br>2. `GET /api/anuncios/:id` sem token | — | `200`; o objeto `usuario` contém apenas `id` e `nome`, sem `email`, `telefone` nem `senha_hash` |
| CT-11 | `RN-02` | Anúncio de A e usuário B autenticado | 1. `PUT /api/anuncios/:id` com o token de B<br>2. `DELETE /api/anuncios/:id` com o token de B | — | `403` "Apenas o autor pode alterar este anúncio."; anúncio inalterado e ainda existente |
| CT-12 | `RF-07`, `RF-08`, `RN-04` | API e Front-End no ar; usuário logado | 1. Abrir `publicar.html`<br>2. Informar data no futuro e publicar<br>3. Escolher uma foto de 6 MB e depois um `.txt`<br>4. Escolher a categoria "Documento"<br>5. Voltar a "Objeto", anexar uma foto válida e publicar com data passada<br>6. Abrir a vitrine | Fotos reais; data e hora do achado | 2. "A data e a hora não podem estar no futuro."<br>3. Mensagens de tamanho e de formato<br>4. Área de upload oculta e aviso de LGPD<br>5. "Item publicado!"<br>6. Card com a foto e a data e hora informadas |
| CT-13 | `RNF-02` | 50 anúncios ativos no banco de teste | 1. Fazer 20 requisições `GET /api/anuncios` e medir cada uma | — | Tempo médio abaixo de 800 ms, registrado na evidência |

## 7. Matriz de rastreabilidade

### 7.1 Requisitos e casos de teste

| Requisito | Descrição | Casos | Situação dos casos |
| --- | --- | --- | --- |
| `RF-01` | Autenticação e cadastro | CT-01, CT-02 | Aprovados |
| `RF-07` | Cadastro de anúncio | CT-03, CT-04, CT-12 | Aprovados |
| `RF-08` | Upload de fotos | CT-03, CT-05, CT-06, CT-08, CT-09, CT-12 | Aprovados |
| `RN-02` | Só o autor altera o anúncio | CT-11 | Aprovado |
| `RN-04` | LGPD: sem dados pessoais e sem foto de documento | CT-07, CT-10, CT-12 | Aprovados |
| `RNF-02` | Desempenho | CT-13 | Aprovado (média de 8,5 ms) |
| `RNF-03` | Segurança | CT-01, CT-02, CT-05, CT-09 | Aprovados |

### 7.2 Defeitos e casos de teste

| Defeito | Issue | Descrição | Casos que comprovam a correção | Resultado |
| --- | --- | --- | --- | --- |
| M-15 | [#49](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/49) | `data_ocorrencia` não é gravada | CT-04, CT-12 | Corrigido: CT-04 aprovado |
| M-16 | [#50](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/50) | URLs externas aceitas como foto em JSON | CT-05 | Corrigido no cadastro (PR #58) e na edição (PR [#68](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/68)) |
| M-18 | [#51](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/51) | `mime_type` e `tamanho_bytes` não são gravados | CT-06 | Corrigido: CT-06 aprovado |

## 8. Critérios de aprovação e reprovação

**Por caso de teste:**

- **Aprovado:** o resultado obtido corresponde ao esperado em todos os passos.
- **Reprovado:** o resultado diverge em qualquer passo. A divergência vira uma Issue com o rótulo `bug`, que cita o `CT-xx` e a severidade.
- **Não executado:** o caso não pôde rodar. O motivo fica registrado na seção 9.

**Severidade dos defeitos:**

- **Alta:** falha de segurança, violação da LGPD ou perda de dado.
- **Média:** funcionalidade incorreta, mas com alternativa para o usuário.
- **Baixa:** problema de apresentação ou de dado secundário.

**Pela suíte, para a criação da tag `sprint-07`:**

- os casos de risco alto (CT-01, CT-02, CT-05, CT-07, CT-08, CT-09, CT-10 e CT-11) aprovados;
- CT-03, CT-04 e CT-06 aprovados depois das correções das Issues #49, #50 e #51;
- nenhum defeito de severidade alta aberto sem justificativa registrada;
- suíte automatizada executada sem falhas na `main` após o último merge;
- evidência para cada caso executado em `docs/testes/evidencias/`.

O CT-13 é uma medição. Se reprovar, vira débito para a Sprint 8, sem bloquear a tag.

## 9. Registro de execução

Execução automatizada em 16/11/2026, com a suíte da Issue [#53](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/53) rodando no banco de teste isolado: 31 testes aprovados de 31 ([suíte](evidencias/2026-11-16_1956_suite-automatizada.md), [log](evidencias/2026-11-16_1956_suite-automatizada.log)). Antes das correções das Issues #49, #50 e #51, a mesma suíte teve 7 reprovações, todas nos testes de M-15, M-16 e M-18 ([antes](evidencias/sprint-07-testes-antes.txt)). O ambiente de teste foi verificado em [`2026-11-16_1526_ambiente-de-teste.md`](evidencias/2026-11-16_1526_ambiente-de-teste.md), e a persistência das fotos no volume, em [`2026-11-16_1524_volume-uploads.md`](evidencias/2026-11-16_1524_volume-uploads.md).

Os testes automatizados não citam os IDs `CT-xx` no nome. A coluna **Testes** relaciona cada caso aos testes da suíte pelo nome usado no relatório.

| Caso | Forma de execução | Data | Testes | Resultado | Evidência |
| --- | --- | --- | --- | --- | --- |
| CT-01 | Automatizada | 16/11/2026 | "login válido devolve token JWT"; "login com senha errada ou e-mail inexistente devolve 401 genérico" | Aprovado | [suíte](evidencias/2026-11-16_1956_suite-automatizada.md) |
| CT-02 | Automatizada | 16/11/2026 | "GET /perfil rejeita token ausente, malformado, inválido e expirado"; "recusa publicar sem token" | Parcial: passos 1, 2 e 4 aprovados; o passo 3 (token assinado com o segredo antigo) não foi testado | [suíte](evidencias/2026-11-16_1956_suite-automatizada.md) |
| CT-03 | Automatizada | 16/11/2026 | "cria anúncio com foto em multipart e serve a imagem em /uploads" | Aprovado | [suíte](evidencias/2026-11-16_1956_suite-automatizada.md) |
| CT-04 | Automatizada | 16/11/2026 | "grava e devolve a data informada na criação"; "permite alterar a data na edição" | Aprovado (reprovado antes da correção da Issue #49) | [suíte](evidencias/2026-11-16_1956_suite-automatizada.md), [antes](evidencias/sprint-07-testes-antes.txt) |
| CT-05 | Automatizada | 16/11/2026 | "recusa URL externa de foto em JSON"; "recusa URL enviada como campo de texto no multipart" | Parcial: passo 1 aprovado; o passo 2 (edição com URL externa) não foi testado, e o `FotosHandler` só bloqueia URLs no cadastro (seção 9.1) | [suíte](evidencias/2026-11-16_1956_suite-automatizada.md), [antes](evidencias/sprint-07-testes-antes.txt) |
| CT-06 | Automatizada | 16/11/2026 | "grava mime_type e tamanho_bytes" | Aprovado (reprovado antes da correção da Issue #51) | [suíte](evidencias/2026-11-16_1956_suite-automatizada.md), [antes](evidencias/sprint-07-testes-antes.txt) |
| CT-07 | Automatizada | 16/11/2026 | "recusa foto em anúncio de documento e não grava nada em disco"; "recusa, na edição, transformar anúncio com foto em documento" | Aprovado | [suíte](evidencias/2026-11-16_1956_suite-automatizada.md) |
| CT-08 | Automatizada | 16/11/2026 | "recusa mais de 3 fotos"; "recusa foto acima de 5 MB" | Aprovado | [suíte](evidencias/2026-11-16_1956_suite-automatizada.md) |
| CT-09 | Automatizada (integração, e não unidade como previsto) | 16/11/2026 | "recusa arquivo com MIME falso (conteúdo não é imagem)" | Aprovado | [suíte](evidencias/2026-11-16_1956_suite-automatizada.md) |
| CT-10 | Automatizada | 16/11/2026 | "a vitrine pública não expõe e-mail, telefone nem senha_hash de nenhum autor" | Aprovado | [suíte](evidencias/2026-11-16_1956_suite-automatizada.md) |
| CT-11 | Automatizada | 16/11/2026 | "só o autor edita e exclui" | Aprovado | [suíte](evidencias/2026-11-16_1956_suite-automatizada.md) |
| CT-12 | Manual | 16/11/2026 | Roteiro de 9 passos no Firefox (Issue [#54](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/54)) | Aprovado: 9 de 9 passos | [roteiro](evidencias/2026-11-16_front-ct12-interface.md) |
| CT-13 | Automatizada | — | — | Não executado: a medição de tempo de resposta não foi implementada | — |

### 9.1 Resumo e defeitos encontrados

| Situação | Casos |
| --- | --- |
| Aprovados | CT-01 a CT-13 (situação final, após a PR #68) |
| Parciais | Nenhum |
| Não executados | Nenhum |
| Reprovados | Nenhum |

A suíte também cobre comportamentos fora dos casos do plano: cadastro sem `senha_hash` na resposta, e-mail duplicado, `tipo_usuario` enviado pelo cliente ignorado, campos obrigatórios, categoria fora da lista, formato GIF recusado, data futura ou inválida e documento sem foto aceito.

**Reexecução em 22/11/2026** (Sprint 8, após a PR [#66](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/66)): 31 de 31 aprovados, com 88,88% das linhas cobertas ([suíte](evidencias/2026-11-22_0957_suite-automatizada.md)).

**Execução final em 22/11/2026** (após a PR [#68](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/68)): 50 de 50 aprovados, com 92,03% das linhas cobertas e os testes já agrupados por `CT-xx` ([suíte](evidencias/2026-11-22_2252_suite-automatizada.md)). O passo 3 do CT-02 e o passo 2 do CT-05 ganharam testes, e o CT-13 mediu 8,5 ms de média. A tabela de resumo acima mostra a situação final; a tabela de execução mostra a da Sprint 7.

**Defeito encontrado na revisão:** a correção da Issue #50 (M-16) bloqueia URLs apenas no cadastro. Na edição (`PUT /api/anuncios/:id`), uma URL externa com extensão de imagem ainda é aceita e gravada como foto ([`FotosHandler.js`](../../API/Back-End/src/services/validations/FotosHandler.js), condição `contexto.acao === "CRIAR"`). Severidade alta (seção 8), por permitir foto sem validação de tipo, tamanho e conteúdo. Deve virar Issue com o rótulo `bug`, citando o CT-05. **Corrigido na Sprint 8** (PR [#68](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/68)).

**Situação frente aos critérios da seção 8:** os casos de risco alto CT-01, CT-07, CT-08, CT-09, CT-10 e CT-11 estão aprovados, assim como CT-03, CT-04 e CT-06. CT-02 e CT-05 ficaram parciais, e o defeito do CT-05 é de severidade alta. A tag `sprint-07` pode ser criada com essas pendências justificadas aqui, ou depois da correção do PUT e do teste do token com segredo antigo.

## 10. Defeitos conhecidos fora da suíte

| Defeito | Situação | Motivo |
| --- | --- | --- |
| M-17 | Corrigido na Sprint 8 (PR [#66](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/66)) | Verificado fora da suíte Jest pelo script `npm run test:seeders`, que roda os seeders três vezes ([evidência](evidencias/2026-11-22_0956_seeders-idempotentes.md)) |
| M-11 | Corrigido em parte na Sprint 8 (PR [#66](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/66)) | Verificado pela subida do ambiente de teste com a senha lida do `.env` ([evidência](evidencias/2026-11-22_0957_ambiente-de-teste.md)) |

As melhorias e os defeitos citados estão descritos na seção 4 de [`decisoes-de-projeto.md`](../projeto/decisoes-de-projeto.md).
