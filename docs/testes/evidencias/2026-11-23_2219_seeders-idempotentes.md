# Evidência — Seeders idempotentes (M-17)

- **Data:** 2026-11-24T01:19:31.720Z
- **Banco:** `radar_ufla_test` em `db_test:3306`
- **O que prova:** rodar os seeders várias vezes não falha nem duplica registros. Antes da correção, o seeder de demonstração tentava recriar `admin@ufla.br`, o e-mail único falhava (`SequelizeUniqueConstraintError`) e o `docker-entrypoint.sh` derrubava a API.
- **Resultado:** ✅ seeders idempotentes

| Execução | Saída | Detalhe |  |
| --- | --- | --- | --- |
| Seeders na preparação (1ª vez) | — | admin 1, fixtures 2, anúncios 50 | ✅ |
| db:seed:all de novo (2ª vez) | código 0 | [demo-usuarios] admin@ufla.br já existe; nada a fazer. / [test-fixtures] Fixtures já carregadas; nada a fazer. | ✅ |
| db:seed:all de novo (3ª vez) | código 0 | [demo-usuarios] admin@ufla.br já existe; nada a fazer. / [test-fixtures] Fixtures já carregadas; nada a fazer. | ✅ |
| Contagem final igual à inicial | — | admin 1, fixtures 2, anúncios 50 | ✅ |

Gerado por `tests/ambiente/validar-seeders.js`.
