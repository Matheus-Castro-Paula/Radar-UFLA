# Evidências de execução

Logs e relatórios gerados pelos scripts de [`API/Back-End/tests/ambiente/`](../../../API/Back-End/tests/ambiente/README.md). Os nomes começam com data e hora (`AAAA-MM-DD_HHMM`) da execução, no horário de Brasília.

## Sprint 8

Execução de 22/11/2026, depois das correções M-11 (senhas fora do Compose) e M-17 (seeders idempotentes). A suíte e os seeders rodaram no ambiente isolado (`npm run test:docker`) e o volume foi validado no `docker-compose.yml` de desenvolvimento já com as credenciais vindas do `.env`.

| Evidência | O que prova | Resultado |
| --- | --- | --- |
| [2026-11-22_0957_suite-automatizada.md](2026-11-22_0957_suite-automatizada.md) | Suíte Jest/Supertest completa no container de teste: 31 de 31 testes aprovados, com **cobertura de 88,9% das linhas** e 88,1% das instruções (resumo e tabela por arquivo no relatório). Log bruto em [2026-11-22_0957_suite-automatizada.log](2026-11-22_0957_suite-automatizada.log) | ✅ |
| [2026-11-22_0956_seeders-idempotentes.md](2026-11-22_0956_seeders-idempotentes.md) | M-17: os seeders rodam três vezes seguidas sem erro e sem duplicar registros | ✅ |
| [2026-11-22_0957_ambiente-de-teste.md](2026-11-22_0957_ambiente-de-teste.md) | O container de teste sobe do zero, com a senha do MySQL vinda do `.env` (M-11), aplica as 7 migrations e carrega as fixtures | ✅ |
| [2026-11-22_0957_volume-uploads.md](2026-11-22_0957_volume-uploads.md) | Com o `docker-compose.yml` corrigido (M-11), a foto enviada continua igual (sha256) depois que o container da API é recriado | ✅ |

## Sprint 7

| Evidência | O que prova | Resultado |
| --- | --- | --- |
| [2026-11-16_1526_ambiente-de-teste.md](2026-11-16_1526_ambiente-de-teste.md) | O container de teste (`docker-compose.test.yml`) sobe do zero, aplica as 7 migrations, carrega as fixtures (50 anúncios ativos, usuário comum e admin) e isola a pasta de uploads | ✅ |
| [2026-11-16_1524_volume-uploads.md](2026-11-16_1524_volume-uploads.md) | Uma foto enviada pela API continua disponível, com o mesmo conteúdo (sha256), depois que o container da API é recriado: o volume `uploads_data` persiste os arquivos (ADR-08) | ✅ |
| [2026-11-16_1956_suite-automatizada.md](2026-11-16_1956_suite-automatizada.md) | Execução completa da suíte Jest/Supertest (31 testes passando, incluindo autenticação JWT, upload, RN-04 e regressões M-15, M-16 e M-18) — log bruto em [2026-11-16_1956_suite-automatizada.log](2026-11-16_1956_suite-automatizada.log) e execução pré-correções em [sprint-07-testes-antes.txt](sprint-07-testes-antes.txt) | ✅ |

| [2026-11-16_front-ct12-interface.md](2026-11-16_front-ct12-interface.md) | Roteiro manual de interface do CT-12, com capturas de tela (Issue [#54](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/54)) | — |

## Pendente

- **Nova execução da suíte depois das correções de back-end da Sprint 8** (M-10, M-13, M-16 na edição, M-05 e prefixos `CT-xx` nos nomes dos testes): basta rodar `npm run test:docker` após o merge, para o relatório trazer o resultado agrupado por caso `CT-01` a `CT-13`.