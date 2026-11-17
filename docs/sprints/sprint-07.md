# Sprint 7 — Estratégia de testes e primeira execução verificável

- **Data de entrega:** 16/11/2026
- **Pontuação:** 2,5 pontos
- **Tag obrigatória:** `sprint-07`
- **Responsável por conferir este arquivo:** Luis Gustavo Borges Vilela Marques (@Luis-Marques06)

## 1. Pergunta que esta sprint deve responder

**Quais riscos e funcionalidades serão testados, como e com quais resultados iniciais?**

Foram priorizados os fluxos críticos de segurança e integridade do produto: autenticação e proteção por JWT (`RF-01`, `RNF-03`), autoria de anúncios (`RN-02`), bloqueio LGPD de fotos em documentos (`RN-04`), persistência de ocorrência e upload local de mídias via Multer (`RF-07`, `RF-08`) e tempo de resposta da vitrine (`RNF-02`). A verificação combinou testes automatizados de integração (`Jest` + `Supertest`) em banco MySQL isolado (`radar_ufla_test`) e roteiro manual ponta a ponta na interface (`CT-12`). Os 31 testes automatizados passaram com **88,88% de cobertura de linhas**, os 9 passos manuais foram aprovados e 3 defeitos encontrados na execução inicial (`M-15`, `M-16` e `M-18`) foram corrigidos e validados por reteste.

## 2. Objetivo e resultado da sprint

**Objetivo planejado:** Elaborar a estratégia formal de verificação e validação (`docs/testes/plano-de-testes.md`), estruturar um ambiente isolado de testes (`NODE_ENV=test`), implementar a primeira suíte automatizada de integração (`Jest` + `Supertest`), executar testes manuais nos fluxos prioritários de interface (`CT-12`), registrar defeitos encontrados como Issues e comprovar ao menos uma correção com reteste.

**Resultado efetivamente alcançado:** O plano de testes (`docs/testes/plano-de-testes.md`) foi estruturado com 13 casos de teste (`CT-01` a `CT-13`), critérios de aprovação e matriz requisito–teste (`#52`). A suíte automatizada (`#53`) alcançou **2 suítes e 31 testes de integração passando** (**88,88% de cobertura de linhas**), e o roteiro manual de interface (`CT-12` / `#54`) obteve **9 de 9 passos aprovados** com capturas de tela preservadas. Durante os testes iniciais foram detectados 3 defeitos (`M-15` / `#49`, `M-16` / `#50` e `M-18` / `#51`), todos corrigidos, retestados e documentados com logs comparativos antes e depois em `docs/testes/evidencias/`.

## 3. Checklist do artefato central — 0,75 ponto

**Entrega esperada:** `docs/testes/plano-de-testes.md`, casos de teste completos, critérios de aprovação e matriz requisito–teste.

- [x] Objetivo, escopo, tipos e níveis de teste definidos.
- [x] Casos com pré-condição, dados, passos e resultado esperado.
- [x] Primeiros resultados registrados.
- [x] Código de testes em `tests/` ou equivalente, quando aplicável.
- [x] Defeitos e ao menos uma correção/reteste, caso encontrados.

### Links dos artefatos

| Artefato criado/atualizado | Link na tag da sprint | O que mudou |
| :--- | :--- | :--- |
| `docs/testes/plano-de-testes.md` | [plano-de-testes.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/docs/testes/plano-de-testes.md) | Definição da estratégia de testes, ambiente isolado, casos `CT-01` a `CT-13`, critérios de aprovação e matriz requisito–teste (`#52`). |
| `API/Back-End/tests/` | [API/Back-End/tests/](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-07/API/Back-End/tests) | Implementação das suítes `autenticacao.test.js` (8 testes) e `anuncios.test.js` (23 testes), `helpers.js` e guia de ambiente isolado (`#53`). |
| `docs/testes/evidencias/` | [docs/testes/evidencias/](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-07/docs/testes/evidencias) | Preservação dos logs da suíte automatizada (antes/depois das correções e cobertura) e das 9 capturas de tela do roteiro manual (`CT-12` / `#54`). |
| `docs/requisitos/requisitos.md` | [requisitos.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/docs/requisitos/requisitos.md) | Inclusão da Seção 7 com matriz de rastreabilidade vinculando requisitos e débitos (`M-15`, `M-16`, `M-18`) aos casos `CT-01` a `CT-13`. |
| `docs/backlog-produto.md` | [backlog-produto.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/docs/backlog-produto.md) | Encerramento dos itens `T-13` a `T-15`, registro das entregas `T-16` a `T-19`, fechamento de `M-15`, `M-16` e `M-18` e cadastro de `M-17`. |
| `README.md` | [README.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/README.md) | Adição da Seção 11 com instruções de execução dos testes automatizados via `yarn` e atualização do estado atual do projeto. |

## 4. Incremento da aplicação web — 0,75 ponto

**Incremento mínimo esperado:** Testes executados para ao menos um fluxo prioritário, saída/relatório preservado e defeitos registrados como Issues.

### O que foi implementado ou evoluído

Implementação da suíte automatizada de integração (`Jest` + `Supertest`) sobre banco MySQL isolado (`radar_ufla_test` com `NODE_ENV=test`), cobrindo cadastro/login, JWT, autoria de anúncios, regra LGPD para documentos, upload de fotos e desempenho da vitrine. A execução inicial identificou três falhas latentes que foram corrigidas no Back-End e validadas por reteste: persistência e rejeição de datas futuras em `data_ocorrencia` (`M-15` / `#49`), bloqueio de URLs externas via payload JSON no campo `fotos` (`M-16` / `#50`) e gravação dos metadados `mime_type` e `tamanho_bytes` na tabela `foto_anuncio` (`M-18` / `#51`). No Front-End, foi executado o roteiro manual `CT-12` (`#54`), comprovando visualmente as validações do formulário e a exibição correta da data/hora e das imagens na vitrine.

### Como executar e verificar

1. **Configurar e subir o ambiente isolado de testes** conforme detalhado em [`API/Back-End/tests/ambiente/README.md`](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/API/Back-End/tests/ambiente/README.md).

2. **Acessar o diretório do Back-End e instalar as dependências:**
   ```bash
   cd API/Back-End
   yarn install
   ```

3. **Executar a suíte completa com relatório detalhado e cobertura:**
   ```bash
   yarn test --verbose --coverage
   ```

| Requisito/Issue | Código ou protótipo | Evidência de execução |
| :--- | :--- | :--- |
| `RF-01`, `RNF-03` / `#53` | [autenticacao.test.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/API/Back-End/tests/autenticacao.test.js) | [evidencias/](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-07/docs/testes/evidencias) (`CT-01`, `CT-02` — 8 testes passando) |
| `RF-07` / `#49`, `#53` | [DataOcorrenciaHandler.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/API/Back-End/src/validations/DataOcorrenciaHandler.js), [anuncios.test.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/API/Back-End/tests/anuncios.test.js) | [evidencias/](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-07/docs/testes/evidencias) (`CT-03`, `CT-04` — regressão M-15 validada) |
| `RF-08`, `RNF-03` / `#50`, `#51`, `#53` | [FotosHandler.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/API/Back-End/src/validations/FotosHandler.js), [AnuncioService.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/API/Back-End/src/services/AnuncioService.js) | [evidencias/](https://github.com/Matheus-Castro-Paula/tree/sprint-07/docs/testes/evidencias) (`CT-05`, `CT-06`, `CT-08`, `CT-09` — M-16 e M-18 validados) |
| `RN-02`, `RN-04`, `RNF-02` / `#53` | [RegraLGPDHandler.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/API/Back-End/src/validations/RegraLGPDHandler.js), [anuncios.test.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/API/Back-End/tests/anuncios.test.js) | [evidencias/](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-07/docs/testes/evidencias) (`CT-07`, `CT-10`, `CT-11`, `CT-13` — 23 testes passando) |
| `RF-07`, `RF-08`, `RN-04` / `#54` | [publicar.html](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/API/Front-End/publicar.html), [app.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/API/Front-End/app.js) | [evidencias/](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-07/docs/testes/evidencias) (`CT-12` — 9/9 passos aprovados com capturas) |

## 5. Scrum e gestão do trabalho — 0,50 ponto

### Sprint Backlog

| Issue | Descrição | Responsável | Critério de aceitação/conclusão | Situação |
| :--- | :--- | :--- | :--- | :--- |
| [#52](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/52) | Elaborar Plano de Testes (`plano-de-testes.md`) e matriz de rastreabilidade (`CT-01` a `CT-13`) (`T-16`) | @BernarDEVthomaz | Plano documentado com estratégia, ambiente isolado, casos completos e critérios de aprovação. | Concluída |
| [#49](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/49) | Corrigir defeito `M-15`: persistência e validação de `data_ocorrencia` ao criar/editar anúncio | @Matheus-Castro-Paula, @Artxisto | Campo `data_ocorrencia` salvo no MySQL, datas futuras rejeitadas (HTTP 400) e reteste aprovado (`CT-04`). | Concluída |
| [#50](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/50) | Corrigir defeito `M-16`: bloquear envio de URLs externas no campo `fotos` via payload JSON | @Matheus-Castro-Paula, @Artxisto | Payload JSON com URLs externas recusado; aceito apenas upload via Multer com reteste aprovado (`CT-05`). | Concluída |
| [#51](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/51) | Corrigir defeito `M-18`: gravar metadados `mime_type` e `tamanho_bytes` em `foto_anuncio` | @Matheus-Castro-Paula, @Artxisto | Metadados técnicos gravados no banco a cada upload e comprovados via teste de integração (`CT-06`). | Concluída |
| [#53](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/53) | Implementar suíte automatizada (`Jest` + `Supertest`), ambiente isolado e logs antes/depois (`T-17`) | @Matheus-Castro-Paula, @Artxisto | 31 testes passando em banco isolado (`radar_ufla_test`), cobertura medida (88,88%) e logs salvos em `evidencias/`. | Concluída |
| [#54](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/54) | Executar roteiro manual de interface (`CT-12`) e registrar evidências visuais (`T-18`) | @rodrigopenha13 | 9 passos executados no navegador com capturas de tela e relatório salvos em `docs/testes/evidencias/`. | Concluída |
| — | Consolidar rastreabilidade em `requisitos.md`, `README.md`, `backlog-produto.md` e `sprint-07.md` (`T-19`) | @Luis-Marques06 | Documentação alinhada, Issues vinculadas no Project e tag `sprint-07` publicada. | Concluída |

### Acompanhamento

- **GitHub Project:** [Projects - Radar UFLA](https://github.com/users/Matheus-Castro-Paula/projects/2)
- **Reuniões/decisões:** Alinhamento técnico da equipe para definição do ambiente isolado de testes (`NODE_ENV=test`), priorização das correções `M-15`, `M-16` e `M-18` e definição do roteiro visual `CT-12`, registrados nas Issues `#49` a `#54`.
- **Impedimentos:** Nenhum impedimento bloqueante. As 3 falhas reveladas pela primeira execução dos testes (`M-15`, `M-16` e `M-18`) foram convertidas em Issues corretivas e resolvidas dentro da própria sprint.
- **Mudanças de escopo:** Nenhuma mudança no escopo funcional do produto; inclusão planejada das tarefas corretivas (`#49`, `#50`, `#51`) decorrentes da execução da suíte de testes.

## 6. GitHub, documentação e rastreabilidade — 0,50 ponto

| Tipo de evidência | Link | O que comprova |
| :--- | :--- | :--- |
| Issue | [#49](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/49), [#50](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/50), [#51](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/51), [#52](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/52), [#53](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/53), [#54](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/54) | Rastreamento completo do plano de testes, defeitos encontrados, correções, suíte automatizada e validação manual. |
| Pull Request / Branch | [`feature/testes-automatizados-sprint-07`](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/feature/testes-automatizados-sprint-07) | Integração das correções `M-15`, `M-16` e `M-18`, da suíte automatizada (`#53`) e das evidências manuais (`#54`). |
| Commit | [`8320d84`](https://github.com/Matheus-Castro-Paula/Radar-UFLA/commit/8320d84), [`59dcf27`](https://github.com/Matheus-Castro-Paula/Radar-UFLA/commit/59dcf27) | Implementação dos 31 testes e correções no Back-End (`8320d84`) e atualização de `requisitos.md` e `README.md` (`59dcf27`). |
| Código/arquivo | [API/Back-End/tests/](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-07/API/Back-End/tests), [plano-de-testes.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/docs/testes/plano-de-testes.md) | Código executável dos testes de integração (`Jest` + `Supertest`) e especificação dos casos `CT-01` a `CT-13`. |
| Teste/captura/relatório | [docs/testes/evidencias/](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-07/docs/testes/evidencias), [sprint-07.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/docs/sprints/sprint-07.md) | Logs brutos de execução (antes e depois das correções), relatório de cobertura (88,88%) e 9 capturas de tela do `CT-12`. |

### Rastreabilidade resumida

| Requisito | Issue | Artefato/modelo/decisão | Código | Teste/evidência |
| :--- | :--- | :--- | :--- | :--- |
| `RF-01`, `RNF-03` | `#04`, `#52`, `#53` | [plano-de-testes.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/docs/testes/plano-de-testes.md) (ADR-02) | [authRoutes.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/API/Back-End/src/routes/authRoutes.js) | `CT-01`, `CT-02` ([autenticacao.test.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/API/Back-End/tests/autenticacao.test.js)) |
| `RF-07` | `#06`, `#07`, `#49`, `#53`, `#54` | [plano-de-testes.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/docs/testes/plano-de-testes.md), [requisitos.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/docs/requisitos/requisitos.md) | [DataOcorrenciaHandler.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/API/Back-End/src/validations/DataOcorrenciaHandler.js) | `CT-03`, `CT-04`, `CT-12` ([evidencias/](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-07/docs/testes/evidencias)) |
| `RF-08`, `RNF-03` | `#10`, `#50`, `#51`, `#53`, `#54` | [plano-de-testes.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/docs/testes/plano-de-testes.md) (ADR-08) | [FotosHandler.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/API/Back-End/src/validations/FotosHandler.js) | `CT-05`, `CT-06`, `CT-08`, `CT-09`, `CT-12` ([evidencias/](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-07/docs/testes/evidencias)) |
| `RN-02` | `#11`, `#52`, `#53` | [plano-de-testes.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/docs/testes/plano-de-testes.md) | [AnuncioService.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/API/Back-End/src/services/AnuncioService.js) | `CT-11` ([anuncios.test.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/API/Back-End/tests/anuncios.test.js)) |
| `RN-04` | `#09`, `#25`, `#52`, `#53`, `#54` | [plano-de-testes.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/docs/testes/plano-de-testes.md) (ADR-03) | [RegraLGPDHandler.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/API/Back-End/src/validations/RegraLGPDHandler.js) | `CT-07`, `CT-10`, `CT-12` ([evidencias/](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-07/docs/testes/evidencias)) |
| `RNF-02` | `#08`, `#52`, `#53` | [plano-de-testes.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/docs/testes/plano-de-testes.md) | [anuncioRoutes.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/API/Back-End/src/routes/anuncioRoutes.js) | `CT-13` ([anuncios.test.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/API/Back-End/tests/anuncios.test.js)) |

## 7. Revisão do incremento

- **O que foi demonstrado:** Execução automatizada via `yarn test --verbose --coverage` (31 testes passando em 2 suítes e 88,88% de cobertura de linhas), logs comparativos comprovando a correção dos defeitos `M-15`, `M-16` e `M-18` e o roteiro de validação manual da interface (`CT-12`) com 9 capturas de tela.
- **Critérios atendidos:** Checklist do artefato central integralmente atendido; ambiente de testes isolado configurado; casos de teste executados com resultados e evidências preservadas; defeitos registrados como Issues, corrigidos e retestados.
- **Itens não concluídos:** Nenhum. Todo o escopo planejado para a Sprint 7 foi concluído.
- **Motivo das pendências:** Não se aplica.
- **Feedback recebido e ajustes:** A execução inicial dos testes revelou 3 falhas de persistência e validação (`M-15`, `M-16` e `M-18`), imediatamente corrigidas na sprint, além da necessidade de restringir o seeder de demonstração (`M-17`), registrada no backlog para tratamento na Sprint 8.

## 8. Retrospectiva e próxima sprint

- **Funcionou bem:** A criação de um banco isolado (`radar_ufla_test` com `NODE_ENV=test`) garantiu reprodutibilidade sem interferir no ambiente de desenvolvimento; a integração entre o plano do Tech Lead (`#52`), os testes de integração do Back-End (`#53`) e a validação visual do Front-End (`#54`) revelou e resolveu defeitos reais antes da estabilização final.
- **Precisa melhorar:** Antecipar o merge das branches de desenvolvimento e a entrega das evidências visuais ao longo da semana para evitar acúmulo de consolidação documental no fechamento da sprint.
- **Ação concreta para a próxima sprint:** Na Sprint 8 (Validação final e estabilização), priorizar o saneamento dos débitos críticos remanescentes (`M-08` a `M-14` e `M-17`), executar verificação de acessibilidade (`RNF-05`), estabilizar a versão candidata (`versao-final`) e congelar alterações de código antes da entrega final.

## 9. O que não será considerado suficiente

- Listar tipos de teste sem aplicá-los.
- Casos sem resultado esperado.
- Declarar que todos passaram sem evidência.

## 10. Links enviados no UFLA Virtual

- **Tag sprint-07:** [sprint-07](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-07)
- **Este arquivo na tag:** [sprint-07.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-07/docs/sprints/sprint-07.md)
- **Observação adicional:** O encerramento formal da Sprint 7 e a geração da tag `sprint-07` consolidam na branch `main` o Plano de Testes (`#52`), as correções dos defeitos `M-15` (`#49`), `M-16` (`#50`) e `M-18` (`#51`), a suíte automatizada com 31 testes e 88,88% de cobertura (`#53`) e as evidências visuais dos testes manuais (`#54`).