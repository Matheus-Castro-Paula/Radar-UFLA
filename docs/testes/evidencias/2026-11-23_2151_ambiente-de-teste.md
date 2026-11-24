# Evidência — Ambiente de banco de testes

- **Data:** 2026-11-24T00:51:47.232Z
- **Banco:** `radar_ufla_test` em `db_test:3306`
- **Pasta de uploads:** `/tmp/uploads-teste`
- **Node:** v20.20.2
- **Resultado:** ✅ ambiente pronto

|  | Verificação | Esperado | Obtido |
| --- | --- | --- | --- |
| ✅ | Conexão com o banco de teste | radar_ufla_test | radar_ufla_test |
| ✅ | Migrations aplicadas | 7 | 7 |
| ✅ | Usuários de fixture | 2 | 2 |
| ✅ | Fixture admin com tipo_usuario = admin | 1 | 1 |
| ✅ | Anúncios ativos para o CT-13 | 50 | 50 |
| ✅ | Fotos no banco (deve começar vazio) | 0 | 0 |
| ✅ | Pasta de uploads de teste gravável e vazia | 0 arquivos | 0 arquivos |
| ✅ | JWT_SECRET próprio do teste definido | sim | sim |

Gerado por `tests/ambiente/verificar.js --evidencia`, depois de `tests/ambiente/banco.js preparar`.
