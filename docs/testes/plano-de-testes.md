# Plano de Testes — Radar UFLA

> Sprint 7 — Issue [#52](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/52) | Responsável: Tech Lead (`@BernarDEVthomaz`)

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
| `RF-01` | Autenticação e cadastro | CT-01, CT-02 | Especificados |
| `RF-07` | Cadastro de anúncio | CT-03, CT-04, CT-12 | Especificados; CT-04 depende da Issue [#49](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/49) |
| `RF-08` | Upload de fotos | CT-03, CT-05, CT-06, CT-08, CT-09, CT-12 | Especificados; CT-05 e CT-06 dependem das Issues [#50](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/50) e [#51](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/51) |
| `RN-02` | Só o autor altera o anúncio | CT-11 | Especificado |
| `RN-04` | LGPD: sem dados pessoais e sem foto de documento | CT-07, CT-10, CT-12 | Especificados |
| `RNF-02` | Desempenho | CT-13 | Especificado |
| `RNF-03` | Segurança | CT-01, CT-02, CT-05, CT-09 | Especificados |

### 7.2 Defeitos e casos de teste

| Defeito | Issue | Descrição | Casos que comprovam a correção |
| --- | --- | --- | --- |
| M-15 | [#49](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/49) | `data_ocorrencia` não é gravada | CT-04, CT-12 |
| M-16 | [#50](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/50) | URLs externas aceitas como foto em JSON | CT-05 |
| M-18 | [#51](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/51) | `mime_type` e `tamanho_bytes` não são gravados | CT-06 |

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

Preenchido com os resultados da suíte automatizada (Issue [#53](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/53)) e das evidências de interface (Issue [#54](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/54)).

| Caso | Forma de execução | Data | Resultado | Evidência |
| --- | --- | --- | --- | --- |
| CT-01 | Automatizada | — | Não executado | — |
| CT-02 | Automatizada | — | Não executado | — |
| CT-03 | Automatizada | — | Não executado | — |
| CT-04 | Automatizada | — | Não executado (defeito M-15 aberto) | — |
| CT-05 | Automatizada | — | Não executado (defeito M-16 aberto) | — |
| CT-06 | Automatizada | — | Não executado (defeito M-18 aberto) | — |
| CT-07 | Automatizada | — | Não executado | — |
| CT-08 | Automatizada | — | Não executado | — |
| CT-09 | Automatizada | — | Não executado | — |
| CT-10 | Automatizada | — | Não executado | — |
| CT-11 | Automatizada | — | Não executado | — |
| CT-12 | Manual | — | Não executado | — |
| CT-13 | Automatizada | — | Não executado | — |

## 10. Defeitos conhecidos fora da suíte

| Defeito | Situação | Motivo |
| --- | --- | --- |
| M-17 | Sem Issue | O seeder impede a API de subir em bancos anteriores à Sprint 6. A suíte parte de banco vazio e não reproduz o problema |
| M-11 | Débito registrado | A senha do banco aparece em três pontos do `docker-compose.yml`. É um problema de configuração, não de comportamento testável pela suíte |

As melhorias e os defeitos citados estão descritos na seção 4 de [`decisoes-de-projeto.md`](../projeto/decisoes-de-projeto.md).
