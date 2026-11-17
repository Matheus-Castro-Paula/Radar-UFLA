# Evidências de execução — Sprint 7

Logs e relatórios gerados pelos scripts de [`API/Back-End/tests/ambiente/`](../../../API/Back-End/tests/ambiente/README.md). Os nomes começam com data e hora (`AAAA-MM-DD_HHMM`) da execução, no horário de Brasília.

| Evidência | O que prova | Resultado |
| --- | --- | --- |
| [2026-11-16_1526_ambiente-de-teste.md](2026-11-16_1526_ambiente-de-teste.md) | O container de teste (`docker-compose.test.yml`) sobe do zero, aplica as 7 migrations, carrega as fixtures (50 anúncios ativos, usuário comum e admin) e isola a pasta de uploads | ✅ |
| [2026-11-16_1524_volume-uploads.md](2026-11-16_1524_volume-uploads.md) | Uma foto enviada pela API continua disponível, com o mesmo conteúdo (sha256), depois que o container da API é recriado: o volume `uploads_data` persiste os arquivos (ADR-08) | ✅ |
| [2026-11-16_1956_suite-automatizada.md](2026-11-16_1956_suite-automatizada.md) | Execução completa da suíte Jest/Supertest (31 testes passando, incluindo autenticação JWT, upload, RN-04 e regressões M-15, M-16 e M-18) — log bruto em [2026-11-16_1956_suite-automatizada.log](2026-11-16_1956_suite-automatizada.log) e execução pré-correções em [sprint-07-testes-antes.txt](sprint-07-testes-antes.txt) | ✅ |

## Ainda não gerado

- **Evidências de interface** (CT-12): capturas de tela do roteiro manual, Issue [#54](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/54).