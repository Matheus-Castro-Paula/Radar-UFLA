# Sprint 8 — Validação final, estabilização e fechamento técnico

- **Data de entrega:** 23/11/2026
- **Pontuação:** 2,5 pontos
- **Tag obrigatória:** `sprint-08`
- **Responsável por conferir este arquivo:** Luis Gustavo Borges Vilela Marques (@Luis-Marques06)

## 1. Pergunta que esta sprint deve responder

**Quais requisitos foram atendidos, quais testes foram executados e qual é a situação final da aplicação?**

- **Requisitos atendidos (9):** `RF-01` (Autenticação e cadastro), `RF-04` (Vitrine pública com resumo de 100 caracteres no feed e modal de detalhes com galeria de até 3 fotos), `RF-07` (Cadastro de anúncio com limite de 200 caracteres na descrição via `DescricaoHandler.js`), `RF-08` (Upload de até 3 fotos em volume local com limpeza de mídias órfãs), `RF-09` (Editar campos/remover fotos e encerrar/excluir anúncio próprio via API e Front-End), `RN-04` (Conformidade LGPD: bloqueio de CPF/documentos no texto, vitrine pública sem dados pessoais e liberação exclusiva do e-mail do autor para usuários autenticados via `GET /api/anuncios/:id/contato`), `RNF-02` (Desempenho aprovado na escala testada: média de 8,5 ms no `CT-13`, meta < 800 ms), `RNF-05` (Acessibilidade WCAG 2.1 AA validada com `axe-core` sem violações nas 5 páginas, além de navegação por teclado no modal e diálogos customizados) e `RNF-06` (Arquitetura em camadas com MySQL e Docker).
- **Requisitos parcialmente atendidos (6):** `RF-02` e `RN-02` (campo `tipo_usuario` gravado e presente no JWT, sem permissões diferenciadas de administrador), `RF-05` (filtros combinados por categoria e local, sem período), `RF-06` (busca textual *case-insensitive* sobre o texto completo, sem normalização de acentos), `RNF-01` (layout responsivo com breakpoint em 720 px, não *mobile-first*) e `RNF-03` (bcrypt, JWT, SQL parametrizado, LGPD, validação de *magic bytes*, bloqueio de URL externa e CORS restrito; pendentes HTTPS `M-08` e usuário dedicado no MySQL `M-11`).
- **Requisitos não atendidos — trabalhos futuros (7 grupos):** `RF-03` (Painel "Meus Anúncios"), `RF-10` (Comentários), `RF-11` (Gestão dinâmica de parâmetros), `RF-12`/`RN-01` (Denúncias e quarentena), `RF-13`/`RN-05` (Notificação automática de match por e-mail), `RF-14`/`RN-03` (Expiração automática em 60 dias) e `RNF-04` (Audit Log `M-09` e alta disponibilidade multi-instância).
- **Testes executados e situação final:** Foram executados **13 casos de teste (`CT-01` a `CT-13`)**, com **100% de aprovação (13/13)**, suíte automatizada em container (`npm run test:docker`, com **52/52 testes aprovados e 92,11% de cobertura de linhas** na execução `2026-11-23_2151`, ampliada pelos testes finais de limite de descrição e rota de contato em `2026-11-23_2219_suite-automatizada.md`), roteiro manual `CT-12` (9/9 passos) e auditoria de acessibilidade `axe-core` (0 violações WCAG 2.1 AA). A aplicação encontra-se estável, containerizada e demonstrável localmente via Docker Compose.

## 2. Objetivo e resultado da sprint

**Objetivo planejado:** Eliminar os débitos técnicos prioritários de segurança, armazenamento e configuração (`M-05`, `M-10`, `M-11`, `M-13`, `M-16` no `PUT` e `M-17`), padronizar e expandir a suíte automatizada com os prefixos `CT-01` a `CT-13`, concluir os controles de edição e encerramento de anúncio (`RF-09`), modal de detalhes (`RF-04`), privacidade de contato (`RN-04`) e acessibilidade (`RNF-05`) no Front-End, consolidar o relatório final de evidências (`docs/testes/evidencias-testes.md`), sincronizar toda a documentação técnica e de gestão (`requisitos.md`, `arquitetura.md`, `backlog-produto.md`, `uso-de-ia.md`, `README.md`) e publicar a tag `sprint-08`.

**Resultado efetivamente alcançado:** Todos os objetivos técnicos e documentais foram concluídos. A suíte automatizada foi expandida com cobertura para os débitos tratados, limite de 200 caracteres na descrição e rota autenticada de contato (`PR #66`, `PR #68` e entrega final de `23/11/2026`); todos os defeitos rastreados (`D-01` a `D-11`) foram corrigidos e comprovados; o Front-End recebeu página de privacidade (`privacidade.html`), modal de detalhes com galeria de fotos, edição completa de anúncios próprios (`RF-09`), contador de descrição, diálogos customizados e correção de contraste aprovada pelo `axe-core` (`RNF-05`); e a documentação foi consolidada antes da geração da tag `sprint-08`.

## 3. Checklist do artefato central — 0,75 ponto

**Entrega esperada:** `docs/testes/evidencias-testes.md`, rastreabilidade final, documentação atualizada, limitações e `docs/uso-de-ia.md`.

- [x] Resultados aprovados, reprovados e não executados quantificados.
- [x] Defeitos ligados a correções e retestes.
- [x] Requisitos classificados como atendidos, parciais ou não atendidos.
- [x] Documentos anteriores compatíveis com a versão final.
- [x] Tag `sprint-08` e preparação da `versao-final`.

### Links dos artefatos

| Artefato criado/atualizado | Link na tag da sprint | O que mudou |
| :--- | :--- | :--- |
| `docs/testes/evidencias-testes.md` | [evidencias-testes.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/testes/evidencias-testes.md) | Relatório final consolidando execuções das Sprints 7 e 8, 13/13 casos aprovados, cobertura da suíte, auditoria `axe-core`, defeitos `D-01` a `D-11`, classificação dos requisitos e limitações. |
| `docs/testes/evidencias/` | [docs/testes/evidencias/](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-08/docs/testes/evidencias) | Logs e relatórios automatizados gerados em `22/11/2026` e `23/11/2026` (`2026-11-23_2151_*` e `2026-11-23_2219_*`) e relatório `axe-core` (`2026-11-24_acessibilidade-axe.md`). |
| `docs/requisitos/requisitos.md` | [requisitos.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/requisitos/requisitos.md) | Confronto final de todos os `RF` e `RNF` com os resultados dos testes, auditoria `RNF-05`, atualização da `RN-04` e fechamento da Seção 7. |
| `docs/arquitetura/arquitetura.md` | [arquitetura.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/arquitetura/arquitetura.md) | Atualização do status dos débitos técnicos (`M-05`, `M-10`, `M-11`, `M-13`, `M-16`, `M-17` tratados) e consolidação das limitações arquiteturais conhecidas. |
| `docs/backlog-produto.md` | [backlog-produto.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/backlog-produto.md) | Atualização do estado final dos itens e débitos técnicos, justificativa formal dos trabalhos futuros (Seção 4.1) e histórico de refinamento da Sprint 8. |
| `docs/uso-de-ia.md` | [uso-de-ia.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/uso-de-ia.md) | Documentação das ferramentas e agentes de IA utilizados (Claude Code, ChatGPT/Gemini e GitHub Copilot), artefatos apoiados e processo de curadoria humana. |
| `docs/sprints/sprint-08.md` | [sprint-08.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/sprints/sprint-08.md) | Relatório final de encerramento, revisão do incremento e rastreabilidade completa da Sprint 8. |

## 4. Incremento da aplicação web — 0,75 ponto

**Incremento mínimo esperado:** Versão estável, testes consolidados, defeitos críticos tratados e aplicação demonstrável localmente ou publicada.

### O que foi implementado ou evoluído

- **Blindagem LGPD e rota protegida de contato (`M-05`, `RN-04`, `RNF-03`):** `RegraLGPDHandler.js` passou a bloquear CPF válido e padrões de documentos pessoais (RG/CNH) no texto do anúncio no cadastro e na edição, ignorando números de telefone de contato e validando apenas os campos alterados no `PUT` (`PR #68` e commit `56d7c00`). Além disso, foi criada a rota autenticada `GET /api/anuncios/:id/contato` (`anuncioRoutes.js`, `anuncioController.js`, `AnuncioService.js`), que libera somente o e-mail do autor para usuários logados (sem telefone e bloqueando anúncios resolvidos/arquivados), mantendo a vitrine pública em conformidade com a `RN-04`.
- **Limite de descrição (200 caracteres) e resumo no feed (`RF-04`, `RF-07`):** Adição do elo `DescricaoHandler.js` na cadeia de validação (`AnuncioValidationChain.js`), rejeitando com HTTP 400 descrições acima de 200 caracteres (validado no `PUT` apenas quando `descricao` é enviada). No Front-End (`app.js`, `styles.css`), o formulário recebeu `maxlength="200"` com contador dinâmico (`0/200`) e o feed principal exibe a primeira linha cortada em 100 caracteres com reticências (`...`), mantendo a busca sobre o texto completo.
- **Modal de detalhes, edição de anúncio, acessibilidade e diálogos customizados (`RF-04`, `RF-09`, `RNF-05`):** Criação de `privacidade.html` e ajuste de contraste do selo `"Achado"` (0 violações WCAG 2.1 AA no `axe-core`). Clicar no card (ou acionar `Enter`/`Espaço`) abre o modal com galeria de até 3 fotos (troca por miniaturas), descrição completa, metadados e linha de contato (`mailto:` para usuários autenticados ou convite para login quando deslogado). Os cards do próprio autor ganharam botões para **Editar** (modal pré-preenchido com `PUT` parcial e remoção de fotos), **Marcar como resolvido** e **Excluir**, substituindo os `window.confirm` nativos por diálogos estilizados acessíveis (foco inicial em Cancelar e fechamento via `ESC`).
- **Exclusão física de mídias órfãs e bloqueio de URL externa no `PUT` (`M-13`, `M-16` / `RF-08`, `RNF-03`):** `MidiaStorage.js` e `AnuncioService.js` passaram a remover do volume `/uploads` os arquivos de fotos descartadas na edição ou exclusão de anúncios após confirmação da transação, enquanto o `PUT /api/anuncios/:id` aceita apenas caminhos `/uploads/` já pertencentes ao próprio anúncio (`PR #68`).
- **Restrição de CORS, variáveis de ambiente e seeders idempotentes (`M-10`, `M-11`, `M-17` / `RNF-03`, `RNF-06`):** `server.js` passou a parametrizar `CORS_ORIGINS` e `PORT` via `.env` (`PR #68`); `docker-compose.yml` e `docker-compose.test.yml` passaram a ler senhas exclusivamente do `.env` com MySQL restrito a `127.0.0.1`; e `20260927221826-demo-usuarios.js` tornou-se idempotente com `findOrCreate` (`PR #66`).

### Como executar e verificar

1. **Configurar as variáveis de ambiente na pasta do Back-End:**
   ```bash
   cd API/Back-End
   cp .env.example .env
   # Preencher DB_PASSWORD, DB_TEST_PASSWORD, JWT_SECRET e CORS_ORIGINS no .env
   ```

2. **Subir a aplicação completa (Front-End, API e MySQL) via Docker Compose:**
   ```bash
   docker compose up -d --build
   # Front-End: http://localhost:8080 | API: http://localhost:3000
   ```

3. **Executar a suíte automatizada isolada em container e gerar relatórios de evidência:**
   ```bash
   npm run test:docker
   ```

| Requisito/Issue | Código ou protótipo | Evidência de execução |
| :--- | :--- | :--- |
| `RN-04`, `RNF-03` (`M-05`, contato protegido) | [RegraLGPDHandler.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/src/services/validations/RegraLGPDHandler.js), [anuncioRoutes.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/src/routes/anuncioRoutes.js) | [2026-11-23_2219_suite-automatizada.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/testes/evidencias/2026-11-23_2219_suite-automatizada.md) (`CT-07`, `CT-10`, testes de `M-05` e `GET /api/anuncios/:id/contato`) |
| `RF-07` (Limite de 200 caracteres) | [DescricaoHandler.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/src/services/validations/DescricaoHandler.js), [app.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Front-End/app.js) | [2026-11-23_2219_suite-automatizada.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/testes/evidencias/2026-11-23_2219_suite-automatizada.md) (testes de 200/201 caracteres e `PUT` parcial) |
| `RF-08`, `RNF-03` (`M-13`, `M-16`) | [MidiaStorage.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/src/services/MidiaStorage.js), [AnuncioService.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/src/services/AnuncioService.js) | [2026-11-23_2151_suite-automatizada.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/testes/evidencias/2026-11-23_2151_suite-automatizada.md) (`CT-05` e 4 testes de `M-13`) |
| `RNF-03`, `RNF-06` (`M-10`, `M-11`, `M-17`) | [server.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/src/server.js), [docker-compose.yml](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/docker-compose.yml), [20260927221826-demo-usuarios.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/src/seeders/20260927221826-demo-usuarios.js) | [2026-11-22_0957_ambiente-de-teste.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/testes/evidencias/2026-11-22_0957_ambiente-de-teste.md), [2026-11-22_0956_seeders-idempotentes.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/testes/evidencias/2026-11-22_0956_seeders-idempotentes.md) |
| `RF-04`, `RF-09`, `RNF-05` | [app.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Front-End/app.js), [privacidade.html](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Front-End/privacidade.html), [styles.css](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Front-End/styles.css) | [2026-11-24_acessibilidade-axe.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/testes/evidencias/2026-11-24_acessibilidade-axe.md), modal de detalhes/edição e `CT-11` |

## 5. Scrum e gestão do trabalho — 0,50 ponto

### Sprint Backlog

| Issue/PR | Descrição | Responsável | Critério de aceitação/conclusão | Situação |
| :--- | :--- | :--- | :--- | :--- |
| [PR #68](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/68) + entrega `23/11` | Corrigir `M-05`, `M-10`, `M-13` e `M-16` (`PUT`), implementar `DescricaoHandler.js` (200 chars), rota `GET /api/anuncios/:id/contato`, modal de detalhes, edição de anúncio e diálogos customizados | @Matheus-Castro-Paula | Suíte `npm run test:docker` 100% aprovada, cobertura > 92% e evidências `2026-11-23_2219_*` geradas. | Concluída |
| [#62](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/62) ([PR #66](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/66)) | Corrigir débitos `M-11` (`.env`) e `M-17` (seeders idempotentes) e validar ambiente isolado via Docker | @Artxisto | Execução limpa do ambiente isolado de teste e 3 execuções dos seeders sem erro. | Concluída |
| [#63](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/63) | Criar `privacidade.html`, implementar controles de `RF-09`, validar acessibilidade `RNF-05` e atualizar `README.md` | @rodrigopenha13 | Página de privacidade publicada, botões de ação integrados à API e verificação ARIA concluída. | Concluída |
| [#64](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/64) | Elaborar relatório final de testes (`evidencias-testes.md`), executar auditoria `axe-core`, alinhar documentação técnica e gerar tag `sprint-08` | @BernarDEVthomaz | Classificação final dos requisitos, defeitos `D-01` a `D-11` comprovados e tag publicada. | Concluída |
| [#65](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/65) | Atualizar quadro no GitHub Project, redigir `uso-de-ia.md` e consolidar `backlog-produto.md` e `sprint-08.md` | @Luis-Marques06 | Backlog sincronizado com trabalhos futuros, uso de IA documentado e checklist fechado. | Concluída |

### Acompanhamento

- **GitHub Project:** [Projects - Radar UFLA](https://github.com/users/Matheus-Castro-Paula/projects/2)
- **Reuniões/decisões:** Planejamento e divisão das entregas finais de estabilização, testes e documentação da Sprint 8 realizados pela equipe, com rastreamento contínuo via Issues (`#62` a `#65`), Pull Requests e diretório `docs/reunioes/`.
- **Impedimentos:** Nenhum impedimento bloqueante. Durante a revisão do `PR #68`, identificou-se falso positivo na regex do `M-05` (bloqueio de telefone junto à sigla `"CNH"` e travamento na resolução de anúncios antigos), corrigido imediatamente no commit `56d7c00`.
- **Mudanças de escopo:**
  - **Refinamento da regra `RN-04`:** Para viabilizar o contato entre interessados e autores mantendo a privacidade da vitrine pública, foi adicionada a rota autenticada `GET /api/anuncios/:id/contato`, expondo exclusivamente o e-mail do autor no modal de detalhes para usuários logados (sem telefone e bloqueando anúncios resolvidos).
  - **Trabalhos futuros:** Funcionalidades secundárias (`RF-03`, `RF-10` a `RF-14`, `RNF-04` e débitos de infraestrutura externa como HTTPS `M-08` e usuário dedicado do MySQL `M-11`) foram consolidadas como trabalhos futuros em `requisitos.md`, `evidencias-testes.md` e `backlog-produto.md`.

## 6. GitHub, documentação e rastreabilidade — 0,50 ponto

| Tipo de evidência | Link | O que comprova |
| :--- | :--- | :--- |
| Issue | [#49](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/49)–[#54](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/54), [#62](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/62), [#63](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/63), [#64](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/64), [#65](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/65) | Rastreabilidade completa das correções de defeitos, plano de testes, estabilização de infra, Front-End, relatório de evidências e gestão da Sprint 8. |
| Pull Request | [PR #66](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/66), [PR #68](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/68) | Revisão por pares e integração das correções de `M-05`, `M-10`, `M-11`, `M-13`, `M-16` (`PUT`), `M-17` e expansão da suíte automatizada. |
| Commit | [56d7c00](https://github.com/Matheus-Castro-Paula/Radar-UFLA/commit/56d7c00), [4e98032](https://github.com/Matheus-Castro-Paula/Radar-UFLA/commit/4e98032), [5028111](https://github.com/Matheus-Castro-Paula/Radar-UFLA/commit/5028111) | Ajuste fino da validação LGPD (`D-11`), página de privacidade, controles de `RF-09` e evolução final do modal de detalhes, edição e contato protegido (`23/11/2026`). |
| Código/arquivo | [DescricaoHandler.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/src/services/validations/DescricaoHandler.js), [RegraLGPDHandler.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/src/services/validations/RegraLGPDHandler.js), [MidiaStorage.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/src/services/MidiaStorage.js), [app.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Front-End/app.js) | Implementação das validações de descrição/LGPD, rota de contato autenticado, exclusão de mídias órfãs, modal de detalhes e edição na interface. |
| Teste/captura/relatório | [evidencias-testes.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/testes/evidencias-testes.md), [2026-11-23_2151_suite-automatizada.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/testes/evidencias/2026-11-23_2151_suite-automatizada.md), [2026-11-23_2219_suite-automatizada.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/testes/evidencias/2026-11-23_2219_suite-automatizada.md), [2026-11-24_acessibilidade-axe.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/testes/evidencias/2026-11-24_acessibilidade-axe.md) | Execução verificável dos 13 casos (`CT-01` a `CT-13`), suíte automatizada 100% aprovada (92,11% de cobertura de linhas) e auditoria WCAG 2.1 AA sem violações. |

### Rastreabilidade resumida

| Requisito | Issue | Artefato/modelo/decisão | Código | Teste/evidência |
| :--- | :--- | :--- | :--- | :--- |
| `RF-01` | `#04`, `#52`, `#53` | [requisitos.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/requisitos/requisitos.md) (ADR-02) | [authController.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/src/controllers/authController.js) | `CT-01`, `CT-02` ([2026-11-23_2151_suite-automatizada.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/testes/evidencias/2026-11-23_2151_suite-automatizada.md)) |
| `RF-04` | `#05`, `#63` | [requisitos.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/requisitos/requisitos.md), [arquitetura.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/arquitetura/arquitetura.md) | [app.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Front-End/app.js) | `CT-10`, `CT-12.6`, `CT-12.7` ([front-ct12-interface.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/testes/evidencias/2026-11-16_front-ct12-interface.md)) + modal de detalhes |
| `RF-07` | `#06`, `#07`, `#11`, `#49` | [requisitos.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/requisitos/requisitos.md) (ADR-03, ADR-04) | [AnuncioService.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/src/services/AnuncioService.js), [DescricaoHandler.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/src/services/validations/DescricaoHandler.js) | `CT-03`, `CT-04`, `CT-12` + testes de limite de 200 caracteres ([2026-11-23_2219_suite-automatizada.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/testes/evidencias/2026-11-23_2219_suite-automatizada.md)) |
| `RF-08` | `#10`, `#50`, `#51` | [arquitetura.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/arquitetura/arquitetura.md) (ADR-08) | [MidiaStorage.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/src/services/MidiaStorage.js), [FotosHandler.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/src/services/validations/FotosHandler.js) | `CT-03`, `CT-05`, `CT-06`, `CT-08`, `CT-09`, `CT-12` |
| `RF-09` | `#11`, `#63` | [requisitos.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/requisitos/requisitos.md), [backlog-produto.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/backlog-produto.md) | [anuncioController.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/src/controllers/anuncioController.js), [app.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Front-End/app.js) | `CT-11` ([2026-11-23_2151_suite-automatizada.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/testes/evidencias/2026-11-23_2151_suite-automatizada.md)) + modal de edição/exclusão |
| `RN-02` | `#04`, `#11`, `#53` | [requisitos.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/requisitos/requisitos.md) | [AnuncioService.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/src/services/AnuncioService.js) | `CT-11` ([2026-11-23_2151_suite-automatizada.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/testes/evidencias/2026-11-23_2151_suite-automatizada.md)) |
| `RN-04` | `#09`, `#25`, `#53`, `#54` | [requisitos.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/requisitos/requisitos.md) (ADR-03, ADR-04) | [RegraLGPDHandler.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/src/services/validations/RegraLGPDHandler.js), [anuncioRoutes.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/src/routes/anuncioRoutes.js) | `CT-07`, `CT-10`, `CT-12`, testes `M-05` e `GET /api/anuncios/:id/contato` |
| `RNF-02` | `#08`, `#40`, `#53` | [arquitetura.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/arquitetura/arquitetura.md), [plano-de-testes.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/testes/plano-de-testes.md) | [app.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Front-End/app.js), índices MySQL | `CT-13` (média 8,5 ms < 800 ms) |
| `RNF-03` | `#04`, `#40`, `#50`, `#53` | [arquitetura.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/arquitetura/arquitetura.md) (ADR-02, ADR-06) | [RegraLGPDHandler.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/src/services/validations/RegraLGPDHandler.js), [server.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/src/server.js) | `CT-01`, `CT-02`, `CT-05`, `CT-09`, testes `M-05`/`M-10`/`M-11` |
| `RNF-05` | `#05`, `#40`, `#63` | [requisitos.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/requisitos/requisitos.md) | [index.html](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Front-End/index.html), [privacidade.html](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Front-End/privacidade.html), [app.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Front-End/app.js) | [2026-11-24_acessibilidade-axe.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/testes/evidencias/2026-11-24_acessibilidade-axe.md) (0 violações WCAG 2.1 AA) |
| `RNF-06` | `#02`, `#03`, `#40`, `#42`, `#62` | [arquitetura.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/arquitetura/arquitetura.md) (ADR-05 a ADR-08) | [docker-compose.yml](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/docker-compose.yml), [docker-compose.test.yml](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/API/Back-End/docker-compose.test.yml) | [2026-11-22_0957_ambiente-de-teste.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/testes/evidencias/2026-11-22_0957_ambiente-de-teste.md) |

## 7. Revisão do incremento

- **O que foi demonstrado:** Execução ponta a ponta em ambiente Docker (`http://localhost:8080` e `http://localhost:3000`): cadastro/login com JWT, publicação com contador de 200 caracteres, vitrine com resumo de 100 caracteres, abertura do modal de detalhes com galeria de até 3 fotos e exibição do e-mail do autor apenas para usuários autenticados (`GET /api/anuncios/:id/contato`), upload local com validação de *magic bytes* e limpeza de mídias órfãs, edição completa (`PUT` parcial), resolução/exclusão de anúncio próprio via diálogos customizados (`RF-09`, `RNF-05`), página `privacidade.html` com 0 violações WCAG 2.1 AA e execução completa da suíte automatizada (`npm run test:docker`).
- **Critérios atendidos:** Todos os 13 casos de teste (`CT-01` a `CT-13`) aprovados; defeitos críticos e médios (`D-01` a `D-11`) tratados e comprovados; auditoria de acessibilidade concluída sem violações; documentação técnica e de gestão sincronizada.
- **Itens não concluídos:** Funcionalidades secundárias do backlog (`RF-03`, `RF-10` a `RF-14`), permissões administrativas (`RF-02`/`RN-02`), filtro por período e normalização de acentos (`RF-05`/`RF-06`), layout *mobile-first* (`RNF-01`), proxy reverso com HTTPS/TLS (`M-08`), usuário dedicado do MySQL (`M-11` restante), Audit Log (`M-09`), paginação no servidor (`M-12`) e monitoramento de uptime (`M-14`).
- **Motivo das pendências:** Priorização de escopo para garantir estabilidade, segurança LGPD e cobertura de testes do núcleo do produto dentro do cronograma acadêmico, além de dependências de infraestrutura externa (certificado TLS, servidor SMTP para e-mails e recriação de volume persistente do MySQL).
- **Feedback recebido e ajustes:** A revisão do `PR #68` apontou dois casos de borda na validação textual da LGPD (`M-05`), corrigidos no commit `56d7c00`. Na estabilização final de `23/11/2026`, foram adicionados o limite de 200 caracteres na descrição (`DescricaoHandler.js`), o modal de detalhes com rota autenticada de e-mail (`RN-04`), a edição completa no Front-End (`RF-09`) e diálogos customizados acessíveis (`RNF-05`).

## 8. Retrospectiva e próxima sprint

- **Funcionou bem:** A integração entre testes automatizados isolados em Docker (`npm run test:docker`), scripts geradores de evidência (`gerar-evidencias.js`), auditoria automatizada de acessibilidade (`axe-core`) e revisão rigorosa via Pull Request permitiu detectar e corrigir regressões reais antes do fechamento da release (`D-02`, `D-03`, `D-05` e `D-11`).
- **Precisa melhorar:** Manter a atualização da documentação de requisitos em paralelo a cada PR desde o início das sprints evita acúmulo de revisão cruzada no fechamento (como o ajuste retroativo de `RF-03` e `RF-10`).
- **Ação concreta para a próxima sprint:** Em evolução futura pós-disciplina, configurar proxy reverso Nginx com TLS/HTTPS (`M-08`), migrar a conexão da API para um usuário dedicado do MySQL com privilégios mínimos (`M-11`) e implementar paginação e busca no servidor (`M-12`) antes de publicar a aplicação em produção no campus.

## 9. O que não será considerado suficiente

- Repetir o plano da Sprint 7.
- Declarar conclusão sem confrontar requisitos e resultados.
- Apresentar apenas slides/vídeo sem artefatos no GitHub.

## 10. Links enviados no UFLA Virtual

- **Tag sprint-08:** [sprint-08](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-08)
- **Este arquivo na tag:** [sprint-08.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-08/docs/sprints/sprint-08.md)
- **Observação adicional:** O encerramento formal da Sprint 8 e a geração da tag `sprint-08` consolidam na branch `main` o relatório final de testes (`docs/testes/evidencias-testes.md`), a suíte automatizada executada em ambiente Docker isolado (`2026-11-23_2151_suite-automatizada.md` e `2026-11-23_2219_suite-automatizada.md`), a auditoria de acessibilidade (`2026-11-24_acessibilidade-axe.md`), o registro de uso de IA (`docs/uso-de-ia.md`) e o alinhamento final de todos os requisitos e trabalhos futuros.