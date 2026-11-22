# Evidências de Testes — Radar UFLA

> Sprint 8 | Responsável: Tech Lead (`@BernarDEVthomaz`) | Base: [`plano-de-testes.md`](plano-de-testes.md)

Relatório final de verificação e validação. Consolida as execuções das Sprints 7 e 8, confronta os resultados com os requisitos de [`requisitos.md`](../requisitos/requisitos.md) e registra o que ficou pendente. As evidências brutas (logs, relatórios gerados e capturas de tela) estão em [`evidencias/`](evidencias/).

## 1. Execuções consideradas

| Data | Tipo | Ambiente | Resultado | Evidência |
| --- | --- | --- | --- | --- |
| 16/11/2026 | Suíte automatizada, antes das correções de M-15, M-16 e M-18 | Banco `radar_ufla_test` isolado | 24 aprovados, 7 reprovados | [`sprint-07-testes-antes.txt`](evidencias/sprint-07-testes-antes.txt) |
| 16/11/2026 | Suíte automatizada, depois das correções | Banco `radar_ufla_test` isolado | 31 de 31 aprovados | [`2026-11-16_1956_suite-automatizada.md`](evidencias/2026-11-16_1956_suite-automatizada.md) |
| 16/11/2026 | Roteiro manual de interface (CT-12) | Firefox, API em Docker | 9 de 9 passos aprovados | [`2026-11-16_front-ct12-interface.md`](evidencias/2026-11-16_front-ct12-interface.md) |
| 16/11/2026 | Persistência das fotos no volume `uploads_data` | Docker Compose de desenvolvimento | Aprovado | [`2026-11-16_1524_volume-uploads.md`](evidencias/2026-11-16_1524_volume-uploads.md) |
| 22/11/2026 | Suíte automatizada com cobertura, após M-11 e M-17 | Container de teste (`npm run test:docker`) | 31 de 31 aprovados; 88,88% das linhas e 69,58% dos ramos | [`2026-11-22_0957_suite-automatizada.md`](evidencias/2026-11-22_0957_suite-automatizada.md) |
| 22/11/2026 | Idempotência dos seeders (M-17) | Container de teste | Três execuções sem erro e sem duplicação | [`2026-11-22_0956_seeders-idempotentes.md`](evidencias/2026-11-22_0956_seeders-idempotentes.md) |
| 22/11/2026 | Ambiente de teste com senha vinda do `.env` (M-11) e volume de fotos | Container de teste e Compose novo | Aprovado | [`2026-11-22_0957_ambiente-de-teste.md`](evidencias/2026-11-22_0957_ambiente-de-teste.md), [`2026-11-22_0957_volume-uploads.md`](evidencias/2026-11-22_0957_volume-uploads.md) |

Para reproduzir: na pasta `API/Back-End`, copie o `.env.example` para `.env`, preencha `DB_PASSWORD`, `DB_TEST_PASSWORD` e `JWT_SECRET` e rode `npm run test:docker`. O relatório e o log saem em `docs/testes/evidencias/`.

## 2. Resumo dos casos de teste

| Situação | Quantidade | Casos |
| --- | --- | --- |
| Aprovados | 10 | CT-01, CT-03, CT-04, CT-06, CT-07, CT-08, CT-09, CT-10, CT-11, CT-12 |
| Parciais | 2 | CT-02, CT-05 |
| Reprovados | 0 | — |
| Não executados | 1 | CT-13 |
| **Total** | **13** | |

Na suíte automatizada, os 31 testes passaram nas duas execuções finais (16/11 e 22/11). Além dos casos do plano, a suíte cobre cadastro sem `senha_hash` na resposta, e-mail duplicado, `tipo_usuario` enviado pelo cliente ignorado, campos obrigatórios, categoria fora da lista, GIF recusado, data futura ou inválida e documento sem foto aceito.

### 2.1 Resultado por caso

| Caso | Requisito | Forma | Resultado | Observação |
| --- | --- | --- | --- | --- |
| CT-01 | `RF-01`, `RNF-03` | Automatizada | Aprovado | Login válido devolve JWT; senha errada devolve 401 genérico |
| CT-02 | `RF-01`, `RNF-03` | Automatizada | Parcial | Token ausente, malformado, inválido e expirado recusados; o passo 3 (token assinado com o segredo antigo) não tem teste próprio |
| CT-03 | `RF-07`, `RF-08` | Automatizada | Aprovado | Foto gravada em `/uploads/<uuid>.png` e servida com `nosniff` |
| CT-04 | `RF-07`, M-15 | Automatizada | Aprovado | Reprovado antes da correção da Issue #49 |
| CT-05 | `RF-08`, `RNF-03`, M-16 | Automatizada | Parcial | Cadastro com URL externa recusado; a edição (`PUT`) ainda aceita URL externa (defeito D-04, seção 3) |
| CT-06 | `RF-08`, M-18 | Automatizada | Aprovado | Reprovado antes da correção da Issue #51 |
| CT-07 | `RN-04` | Automatizada | Aprovado | Documento com foto recusado na criação e na edição, sem arquivo gravado |
| CT-08 | `RF-08` | Automatizada | Aprovado | 4 fotos e foto de 6 MB recusadas |
| CT-09 | `RF-08`, `RNF-03` | Automatizada (integração) | Aprovado | Arquivo com MIME falso recusado pelos bytes iniciais |
| CT-10 | `RN-04` | Automatizada | Aprovado | Vitrine pública devolve só `id` e `nome` do autor |
| CT-11 | `RN-02` | Automatizada | Aprovado | Usuário B recebe 403 ao editar e excluir anúncio de A |
| CT-12 | `RF-07`, `RF-08`, `RN-04` | Manual | Aprovado | 9 de 9 passos, com capturas de tela |
| CT-13 | `RNF-02` | Automatizada | Não executado | A medição de tempo da vitrine ainda não foi implementada na suíte |

### 2.2 Cobertura de código (22/11/2026)

| Métrica | Cobertura |
| --- | --- |
| Linhas | 88,88% (328/369) |
| Instruções | 88,06% (332/377) |
| Funções | 84,48% (49/58) |
| Ramos | 69,58% (135/194) |

Os trechos menos cobertos são `MidiaStorage.js` (77,8% das linhas: a remoção de arquivos não é exercitada) e `FotosHandler.js` (76,3%: os ramos de assinatura de JPEG e WEBP e o caminho da edição). Os dois coincidem com os defeitos D-04 e D-07.

## 3. Defeitos encontrados e correções

| ID | Defeito | Severidade | Como foi encontrado | Correção | Situação | Comprovação |
| --- | --- | --- | --- | --- | --- | --- |
| D-01 | Categoria em texto livre contornava a `RN-04` (`" Documento "`, `"RG"`) | Alta | Revisão de código (Sprint 4) | Lista fechada e normalização da categoria, commit `593156b` | Corrigido | Teste "recusa categoria ' DOCUMENTO ' com foto"; [incidente](../../.harness/incident-log/2026-10-categoria-contornava-rn04.md) |
| D-02 | `data_ocorrencia` não era gravada (M-15) | Alta | Suíte automatizada (CT-04) | Issue [#49](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/49), commit `6fb6ee9` | Corrigido | CT-04 e CT-12.6 |
| D-03 | Cadastro aceitava URL externa como foto em JSON (M-16) | Alta | Suíte automatizada (CT-05) | Issue [#50](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/50), commit `6fb6ee9` | Corrigido no cadastro | CT-05, passo 1 |
| D-04 | Edição (`PUT`) ainda aceita URL externa como foto (resto do M-16) | Alta | Revisão do PR #58 | Restringir o `FotosHandler` a caminhos `/uploads/` também na edição | Em correção na Sprint 8 (`@Matheus-Castro-Paula`) | CT-05, passo 2 |
| D-05 | `mime_type` e `tamanho_bytes` não eram gravados (M-18) | Baixa | Suíte automatizada (CT-06) | Issue [#51](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/51), commit `6fb6ee9` | Corrigido | CT-06 |
| D-06 | Seeder recriava o admin e derrubava a API em bancos anteriores à Sprint 6 (M-17) | Média | Uso do ambiente de desenvolvimento | Seeders idempotentes, PR [#66](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/66) | Corrigido | [`seeders-idempotentes`](evidencias/2026-11-22_0956_seeders-idempotentes.md) |
| D-07 | Arquivos de fotos ficam órfãos em `/uploads` ao excluir anúncio ou trocar fotos (M-13) | Média | Revisão da arquitetura (Sprint 6) | Remover os arquivos no `AnuncioService` via `MidiaStorage.remover` | Em correção na Sprint 8 (`@Matheus-Castro-Paula`) | Teste de arquivos órfãos previsto |
| D-08 | Senha do MySQL escrita no Compose (M-11) | Alta | Revisão da arquitetura (Sprint 6) | Senhas lidas do `.env`, porta do MySQL só em `127.0.0.1`, PR [#66](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/66) | Corrigido em parte: a aplicação ainda usa o usuário `root` | [`ambiente-de-teste`](evidencias/2026-11-22_0957_ambiente-de-teste.md) |
| D-09 | CORS aceita qualquer origem e a porta 3000 é fixa (M-10) | Média | Revisão da arquitetura (Sprint 6) | Restringir origens e ler `PORT` em `server.js` | Em correção na Sprint 8 (`@Matheus-Castro-Paula`) | Teste de CORS previsto |
| D-10 | CPF e número de documento só eram bloqueados no front-end (M-05) | Alta | Revisão de código (Sprint 5) | Validação no `RegraLGPDHandler` | Em correção na Sprint 8 (`@Matheus-Castro-Paula`) | Teste previsto |

**Análise.** Os três defeitos revelados pela primeira execução da suíte (D-02, D-03 e D-05) tinham a mesma origem: colunas e regras criadas na Sprint 6 sem teste que as exercitasse. Desde que a suíte passou a rodar em cada PR, nenhuma regressão voltou a aparecer nesses pontos. Os defeitos de severidade alta restantes (D-04 e D-10) e os débitos de configuração (D-07 e D-09) estão no PR de back-end da Sprint 8. Os de segurança que dependem de infraestrutura (HTTPS, M-08) ficaram como trabalho futuro (seção 5).

## 4. Requisitos atendidos, parcialmente atendidos e não atendidos

### 4.1 Atendidos

| Requisito | Comprovação |
| --- | --- |
| `RF-01` Autenticação e cadastro | CT-01, testes de cadastro da suíte |
| `RF-04` Vitrine pública | CT-10, CT-12.6 e CT-12.7 |
| `RF-07` Cadastro de anúncio | CT-03, CT-04, CT-12 |
| `RF-08` Upload de até 3 fotos | CT-03, CT-06, CT-08, CT-09, CT-12 |
| `RN-04` LGPD: sem dados pessoais e sem foto de documento | CT-07, CT-10, CT-12.4 e CT-12.7 |
| `RNF-06` Arquitetura em camadas com Docker | Ambiente de teste e volume validados nas evidências de 22/11 |

### 4.2 Parcialmente atendidos

| Requisito | O que funciona | O que falta |
| --- | --- | --- |
| `RF-02` Papéis (RBAC) | `tipo_usuario` gravado no cadastro (sempre `comum`) e presente no JWT | Nenhuma permissão de administrador é aplicada |
| `RF-05` Filtros combinados | Categoria e local, combinados na vitrine | Filtro por período |
| `RF-06` Pesquisa textual | Busca em título, descrição e local, sem diferenciar maiúsculas | Não ignora acentos |
| `RF-09` Editar e encerrar anúncio | API `PUT` e `DELETE` com checagem de autoria (CT-11) | Botões na interface, em desenvolvimento na Sprint 8 (`@rodrigopenha13`) |
| `RN-02` Gestão só pelo autor ou admin | Autor verificado na API (CT-11) | O administrador não tem a exceção prevista |
| `RNF-01` Usabilidade | Layout responsivo com breakpoint em 720 px | Não foi construído como mobile-first |
| `RNF-02` Desempenho | Índice `idx_anuncio_tipo_status`; filtros no navegador | CT-13 não executado; listagem sem paginação (M-12) |
| `RNF-03` Segurança | bcrypt, JWT, SQL parametrizado, LGPD e validação de fotos (CT-01, CT-07, CT-09, CT-10) | HTTPS (M-08), CORS restrito (M-10) e resto do M-16 |
| `RNF-05` Acessibilidade | Atributos ARIA em `index.html` | Auditoria com Axe ou WAVE, em execução na Sprint 8 (`@rodrigopenha13`) |

### 4.3 Não atendidos

| Requisito | Motivo |
| --- | --- |
| `RF-03` Painel "Meus anúncios" | Priorizado abaixo da publicação e da vitrine; a API já filtra por autor na autorização, mas não há rota nem tela |
| `RF-10` Comentários | Só a tabela e o model existem; faltam rotas e interface |
| `RF-11` Gestão de categorias e locais | Categorias são lista fixa no código (ADR-03) |
| `RF-12` e `RN-01` Denúncias e quarentena | Falta a entidade `Denuncia` e o status `EM_QUARENTENA` |
| `RF-13` e `RN-05` Notificação de match | Depende de envio de e-mail, fora da infraestrutura do projeto |
| `RF-14` e `RN-03` Expiração em 60 dias | Falta a rotina agendada e o status `EXPIRADO` |
| `RNF-04` Auditoria e disponibilidade | Sem log de auditoria (M-09) e com instância única |

## 5. Limitações conhecidas e trabalhos futuros

- **Segurança de transporte:** a API responde só em HTTP. Publicar atrás de proxy reverso com TLS (M-08).
- **Banco:** a aplicação ainda conecta como `root`. Criar um usuário próprio exige recriar o volume do MySQL, por isso ficou fora do PR #66.
- **Escala da vitrine:** a listagem carrega todos os anúncios ativos e filtra no navegador. Paginar e levar busca e filtros ao servidor (M-12).
- **Autenticação:** o `authController` ainda concentra validação, hash e acesso ao banco (M-01, extrair um `AuthService`).
- **Corrente de validação:** cada handler precisa chamar `super.validar` para a corrente seguir (M-07, Template Method).
- **Testes:** os handlers não têm testes de unidade isolados; tudo é coberto por integração. A interface é verificada só por roteiro manual.
- **Funcionalidades não implementadas:** `RF-03`, `RF-10` a `RF-14`, listadas na seção 4.3 e justificadas no [backlog](../backlog-produto.md).

## 6. Evolução ao longo das oito sprints

| Sprint | Foco | Principal entrega verificável | Reflexo nos testes |
| --- | --- | --- | --- |
| 1 | Problema e visão | Visão geral, backlog inicial e estrutura do repositório | — |
| 2 | Requisitos | `RF-01` a `RF-14`, `RNF-01` a `RNF-06`, histórias com critérios de aceitação; cadastro e login | Critérios de aceitação que viraram os casos CT-01, CT-03 e CT-07 |
| 3 | Modelagem | Casos de uso, sequência, classes e ER ligados ao código | O ER revelou a falta de `tipo_usuario` e `data_ocorrencia` |
| 4 | Princípios de projeto | Camada `AnuncioService`, `RN-04` no back-end (ADR-01 a ADR-03) | Defeito D-01 encontrado e corrigido |
| 5 | Padrões de projeto | Chain of Responsibility nas validações (ADR-04) | 12 cenários iguais antes e depois da refatoração |
| 6 | Arquitetura | Arquitetura C4, Docker, upload com Multer em volume local (ADR-05 a ADR-08) | Débitos M-08 a M-18 levantados; base para os riscos do plano |
| 7 | Estratégia de testes | Plano de testes, suíte Jest/Supertest em banco isolado, roteiro CT-12 | 31 testes; D-02, D-03 e D-05 encontrados e corrigidos |
| 8 | Validação final | Correção de débitos (M-05, M-10, M-11, M-13, M-16, M-17), `RF-09` na interface, acessibilidade, este relatório | 31 testes com cobertura de 88,88%; D-06 e D-08 corrigidos |
