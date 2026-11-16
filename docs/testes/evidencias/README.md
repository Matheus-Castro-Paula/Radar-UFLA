# Evidências de execução — Sprint 7

Logs e relatórios gerados pelos scripts de [`API/Back-End/tests/ambiente/`](../../../API/Back-End/tests/ambiente/README.md). Os nomes começam com data e hora (`AAAA-MM-DD_HHMM`) da execução, no horário de Brasília.

| Evidência | O que prova | Resultado |
| --- | --- | --- |
| [2026-11-16_1526_ambiente-de-teste.md](2026-11-16_1526_ambiente-de-teste.md) | O container de teste (`docker-compose.test.yml`) sobe do zero, aplica as 7 migrations, carrega as fixtures (50 anúncios ativos, usuário comum e admin) e isola a pasta de uploads | ✅ |
| [2026-11-16_1524_volume-uploads.md](2026-11-16_1524_volume-uploads.md) | Uma foto enviada pela API continua disponível, com o mesmo conteúdo (sha256), depois que o container da API é recriado: o volume `uploads_data` persiste os arquivos (ADR-08) | ✅ |

## Ainda não gerado

- **Execução da suíte automatizada** (`*_suite-automatizada.md` e `.log`): depende da suíte Jest/Supertest da Issue [#53](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/53). Quando ela existir, gerar com `npm run test:evidencias` (local) ou `npm run test:docker` (isolado).
- **Evidências de interface** (CT-12): capturas de tela do roteiro manual, Issue [#54](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/54).
