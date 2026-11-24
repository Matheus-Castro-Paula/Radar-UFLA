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
| 22/11/2026 | Suíte automatizada com cobertura, após M-11 e M-17 (PR #66) | Container de teste (`npm run test:docker`) | 31 de 31 aprovados; 88,88% das linhas | [`2026-11-22_0957_suite-automatizada.md`](evidencias/2026-11-22_0957_suite-automatizada.md) |
| 22/11/2026 | Idempotência dos seeders (M-17) | Container de teste | Três execuções sem erro e sem duplicação | [`2026-11-22_0956_seeders-idempotentes.md`](evidencias/2026-11-22_0956_seeders-idempotentes.md) |
| 22/11/2026 | Ambiente de teste com senha vinda do `.env` (M-11) e volume de fotos | Container de teste e Compose novo | Aprovado | [`2026-11-22_0957_ambiente-de-teste.md`](evidencias/2026-11-22_0957_ambiente-de-teste.md), [`2026-11-22_0957_volume-uploads.md`](evidencias/2026-11-22_0957_volume-uploads.md) |
| 22/11/2026 | Suíte final com prefixos `CT-xx`, após M-05, M-10, M-13 e M-16 (PR #68) | Container de teste (`npm run test:docker`) | 50 de 50 aprovados; 92,03% das linhas | [`2026-11-22_2252_suite-automatizada.md`](evidencias/2026-11-22_2252_suite-automatizada.md) |
| 23/11/2026 | Suíte na `main` após o merge do PR #68, com os testes da correção do M-05 | Container de teste (`npm run test:docker`) | **52 de 52 aprovados; 92,11% das linhas** | [`2026-11-23_2151_suite-automatizada.md`](evidencias/2026-11-23_2151_suite-automatizada.md) |
| 24/11/2026 | Auditoria de acessibilidade com axe-core (WCAG 2.1 A e AA) nas 5 páginas | Navegador, API no Docker | 1 violação de contraste encontrada e corrigida; 0 na reexecução | [`2026-11-24_acessibilidade-axe.md`](evidencias/2026-11-24_acessibilidade-axe.md) |
| 23/11/2026 | Teste exploratório no navegador com a API real: cadastro, login, publicação, CPF recusado, CNH com telefone aceita, resolver e excluir (RF-09), CORS e página de privacidade | Docker Compose de desenvolvimento, front na porta 8000 | Aprovado. A `privacidade.html` faltava na primeira rodada e foi conferida depois do commit `4e98032` | Registro nesta seção |

Para reproduzir: na pasta `API/Back-End`, copie o `.env.example` para `.env`, preencha `DB_PASSWORD`, `DB_TEST_PASSWORD` e `JWT_SECRET` e rode `npm run test:docker`. O relatório e o log saem em `docs/testes/evidencias/`, já agrupados por caso `CT-xx`.

## 2. Resumo dos casos de teste

| Situação | Quantidade | Casos |
| --- | --- | --- |
| Aprovados | 13 | CT-01 a CT-13 |
| Parciais | 0 | — |
| Reprovados | 0 | — |
| Não executados | 0 | — |
| **Total** | **13** | |

A execução final tem 50 testes automatizados, todos aprovados. Os 25 que citam um `CT-xx` cobrem 12 casos; o CT-12 é o roteiro manual. Dos outros 25, 14 comprovam as correções da Sprint 8 (6 de M-05, 4 de M-10 e 4 de M-13) e 11 verificam comportamentos fora dos casos do plano: cadastro sem `senha_hash` na resposta, e-mail duplicado, `tipo_usuario` enviado pelo cliente ignorado, campos obrigatórios, categoria fora da lista e data futura ou inválida.

### 2.1 Resultado por caso

| Caso | Requisito | Forma | Testes | Resultado | Observação |
| --- | --- | --- | --- | --- | --- |
| CT-01 | `RF-01`, `RNF-03` | Automatizada | 2 | Aprovado | Login válido devolve JWT; senha errada devolve 401 genérico |
| CT-02 | `RF-01`, `RNF-03` | Automatizada | 3 | Aprovado | Inclui o passo 3 (token assinado com o segredo antigo), que era parcial na Sprint 7 |
| CT-03 | `RF-07`, `RF-08` | Automatizada | 1 | Aprovado | Foto gravada em `/uploads/<uuid>.png` e servida com `nosniff` |
| CT-04 | `RF-07`, M-15 | Automatizada | 2 | Aprovado | Reprovado antes da correção da Issue #49 |
| CT-05 | `RF-08`, `RNF-03`, M-16 | Automatizada | 5 | Aprovado | URL externa recusada no cadastro e na edição; na edição também `../` e foto de outro anúncio |
| CT-06 | `RF-08`, M-18 | Automatizada | 1 | Aprovado | Reprovado antes da correção da Issue #51 |
| CT-07 | `RN-04` | Automatizada | 4 | Aprovado | Documento com foto recusado na criação e na edição, sem arquivo gravado |
| CT-08 | `RF-08` | Automatizada | 3 | Aprovado | 4 fotos, foto de 6 MB e GIF recusados |
| CT-09 | `RF-08`, `RNF-03` | Automatizada (integração) | 1 | Aprovado | Arquivo com MIME falso recusado pelos bytes iniciais |
| CT-10 | `RN-04` | Automatizada | 1 | Aprovado | Vitrine pública devolve só `id` e `nome` do autor |
| CT-11 | `RN-02` | Automatizada | 1 | Aprovado | Usuário B recebe 403 ao editar e excluir anúncio de A |
| CT-12 | `RF-07`, `RF-08`, `RN-04` | Manual | 9 passos | Aprovado | Capturas de tela de cada passo |
| CT-13 | `RNF-02` | Automatizada | 1 | Aprovado | Média de 8,5 ms em 20 requisições com 50 anúncios ativos (meta: 800 ms) |

### 2.2 Cobertura de código (execução final)

| Métrica | Sprint 7 (22/11, PR #66) | Final (22/11, PR #68) |
| --- | --- | --- |
| Linhas | 88,88% | 92,03% (370/402) |
| Instruções | 88,06% | 90,93% (381/419) |
| Funções | 84,48% | 94,11% (64/68) |
| Ramos | 69,58% | 74,55% (167/224) |

O arquivo menos coberto é o `FotosHandler.js` (81,1% das linhas): os ramos de assinatura de JPEG e WEBP não são exercitados, porque os testes usam PNG. O `MidiaStorage.js` subiu de 77,8% para 90,5% com os testes de remoção de arquivos (M-13).

### 2.3 Testes adicionados depois da execução final

A revisão do PR #68 encontrou dois problemas na regra do M-05, corrigidos antes do merge (commit `56d7c00`): telefone de contato ao lado de "CNH" era recusado, e anúncios antigos com número de documento no texto não podiam mais ser resolvidos. Os dois testes que cobrem a correção ("aceita telefone de contato junto da palavra CNH" e "permite resolver anúncio antigo que já tinha documento no texto") foram verificados primeiro chamando o handler diretamente e depois na suíte completa de 23/11/2026: **52 de 52 aprovados** ([suíte](evidencias/2026-11-23_2151_suite-automatizada.md)).

## 3. Defeitos encontrados e correções

| ID | Defeito | Severidade | Como foi encontrado | Correção | Situação | Comprovação |
| --- | --- | --- | --- | --- | --- | --- |
| D-01 | Categoria em texto livre contornava a `RN-04` (`" Documento "`, `"RG"`) | Alta | Revisão de código (Sprint 4) | Lista fechada e normalização da categoria, commit `593156b` | Corrigido | CT-07; [incidente](../../.harness/incident-log/2026-10-categoria-contornava-rn04.md) |
| D-02 | `data_ocorrencia` não era gravada (M-15) | Alta | Suíte automatizada (CT-04) | Issue [#49](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/49), commit `6fb6ee9` | Corrigido | CT-04 e CT-12.6 |
| D-03 | Cadastro aceitava URL externa como foto em JSON (M-16) | Alta | Suíte automatizada (CT-05) | Issue [#50](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/50), commit `6fb6ee9` | Corrigido | CT-05 |
| D-04 | Edição (`PUT`) aceitava URL externa como foto (resto do M-16) | Alta | Revisão do PR #58 | Só caminhos `/uploads/` já publicados no próprio anúncio, PR [#68](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/68) | Corrigido | CT-05 (5 testes) |
| D-05 | `mime_type` e `tamanho_bytes` não eram gravados (M-18) | Baixa | Suíte automatizada (CT-06) | Issue [#51](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/51), commit `6fb6ee9` | Corrigido | CT-06 |
| D-06 | Seeder recriava o admin e derrubava a API em bancos anteriores à Sprint 6 (M-17) | Média | Uso do ambiente de desenvolvimento | Seeders idempotentes, PR [#66](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/66) | Corrigido | [`seeders-idempotentes`](evidencias/2026-11-22_0956_seeders-idempotentes.md) |
| D-07 | Arquivos de fotos ficavam órfãos em `/uploads` (M-13) | Média | Revisão da arquitetura (Sprint 6) | Arquivos removidos depois da confirmação do banco, PR [#68](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/68) | Corrigido | 4 testes de M-13 |
| D-08 | Senha do MySQL escrita no Compose (M-11) | Alta | Revisão da arquitetura (Sprint 6) | Senhas lidas do `.env`, porta do MySQL só em `127.0.0.1`, PR [#66](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/66) | Corrigido em parte: a aplicação ainda usa o usuário `root` | [`ambiente-de-teste`](evidencias/2026-11-22_0957_ambiente-de-teste.md) |
| D-09 | CORS aceitava qualquer origem e a porta 3000 era fixa (M-10) | Média | Revisão da arquitetura (Sprint 6) | Origens em `CORS_ORIGINS` e porta em `PORT`, PR [#68](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/68) | Corrigido | 4 testes de M-10 |
| D-10 | CPF e número de documento só eram bloqueados no front-end (M-05) | Alta | Revisão de código (Sprint 5) | Validação no `RegraLGPDHandler`, PR [#68](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/68) | Corrigido | 6 testes de M-05 |
| D-11 | A regra do M-05 recusava telefone ao lado de "CNH" e travava a edição de anúncios antigos | Média | Revisão do PR #68 | Telefone desconsiderado e checagem só do texto alterado, commit `56d7c00` | Corrigido | 2 testes, aprovados na suíte de 23/11 (seção 2.3) |

**Análise.** Os três defeitos revelados pela primeira execução da suíte (D-02, D-03 e D-05) tinham a mesma origem: colunas e regras criadas na Sprint 6 sem teste que as exercitasse. Na Sprint 8, os débitos de segurança e de arquivos (D-04, D-07, D-09 e D-10) foram corrigidos junto com os testes que os comprovam, e o D-11 mostra que a revisão de código continua encontrando o que os testes não cobrem. Resta aberto só o que depende de infraestrutura: HTTPS (M-08) e o usuário próprio do banco (resto do M-11), descritos na seção 5.

## 4. Requisitos atendidos, parcialmente atendidos e não atendidos

### 4.1 Atendidos

| Requisito | Comprovação |
| --- | --- |
| `RF-01` Autenticação e cadastro | CT-01, CT-02, testes de cadastro da suíte |
| `RF-04` Vitrine pública | CT-10, CT-12.6 e CT-12.7 |
| `RF-07` Cadastro de anúncio | CT-03, CT-04, CT-12 |
| `RF-08` Upload de até 3 fotos | CT-03, CT-05, CT-06, CT-08, CT-09, CT-12 |
| `RN-04` LGPD: sem dados pessoais, sem foto de documento, sem CPF no texto | CT-07, CT-10, CT-12, testes de M-05 |
| `RNF-02` Desempenho | CT-13: média de 8,5 ms com 50 anúncios (meta de 800 ms) |
| `RNF-05` Acessibilidade (WCAG 2.1 AA) | Auditoria com axe-core em 24/11: 0 violações nas 5 páginas, após corrigir o contraste do selo "Achado"; teclado e foco visível conferidos ([relatório](evidencias/2026-11-24_acessibilidade-axe.md)) |
| `RNF-06` Arquitetura em camadas com Docker | Ambiente de teste e volume validados nas evidências de 22/11 |

### 4.2 Parcialmente atendidos

| Requisito | O que funciona | O que falta |
| --- | --- | --- |
| `RF-02` Papéis (RBAC) | `tipo_usuario` gravado no cadastro (sempre `comum`) e presente no JWT | Nenhuma permissão de administrador é aplicada |
| `RF-05` Filtros combinados | Categoria e local, combinados na vitrine | Filtro por período |
| `RF-06` Pesquisa textual | Busca em título, descrição e local, sem diferenciar maiúsculas | Não ignora acentos |
| `RF-09` Editar e encerrar anúncio | Botões "Marcar como Resolvido" e "Excluir" no card do autor, com confirmação, testados no navegador em 23/11; checagem de autoria na API (CT-11) | Editar título, descrição e demais campos pela interface (existe só na API) |
| `RN-02` Gestão só pelo autor ou admin | Autor verificado na API (CT-11) | O administrador não tem a exceção prevista |
| `RNF-01` Usabilidade | Layout responsivo com breakpoint em 720 px | Não foi construído como mobile-first |
| `RNF-03` Segurança | bcrypt, JWT, SQL parametrizado, LGPD, validação de fotos, CORS restrito e senhas fora do Compose | HTTPS (M-08) e usuário próprio do banco (resto do M-11) |

O `RNF-02` conta como atendido para a escala testada (50 anúncios). Com o crescimento da base, a falta de paginação (M-12) volta a ser um risco.

### 4.3 Não atendidos

| Requisito | Motivo |
| --- | --- |
| `RF-03` Painel "Meus anúncios" | Priorizado abaixo da publicação e da vitrine; não há rota nem tela |
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
- **Regra do M-05:** é baseada em padrões de texto. Um número de documento escrito de forma incomum pode passar, e um número de 11 dígitos que por acaso forme um CPF válido é recusado.
- **Testes:** os handlers não têm testes de unidade isolados, só de integração. A interface é verificada só por roteiro manual.
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
| 8 | Validação final | Correção de M-05, M-10, M-11, M-13, M-16 e M-17, `RF-09` na interface, acessibilidade e este relatório | 52 testes, 13 de 13 casos aprovados e 92,11% das linhas cobertas |
