# Ambiente de testes — banco, fixtures, Docker e evidências

Sprints 7 e 8 — responsável: `@Artxisto`. Base: seção 4 de [`plano-de-testes.md`](../../../../docs/testes/plano-de-testes.md).

## O que tem aqui

| Arquivo | Função |
| --- | --- |
| `variaveis.js` | Define `NODE_ENV=test`, a pasta temporária `UPLOADS_DIR` e um `JWT_SECRET` aleatório só para o teste |
| `banco.js` | Recria o `radar_ufla_test`, aplica as migrations do zero, roda os seeders e zera a pasta de uploads. **Recusa** qualquer banco cujo nome não termine em `_test` |
| `globalSetup.js` / `globalTeardown.js` | Ganchos do Jest: preparam o ambiente antes da suíte e apagam os uploads depois |
| `verificar.js` | Confere o ambiente (migrations, fixtures, pasta de uploads, segredo) |
| `gerar-evidencias.js` | Roda o Jest **com cobertura** e grava o log e um relatório (cobertura + resultado por caso `CT-xx`) em `docs/testes/evidencias/` |
| `validar-seeders.js` | Prova que os seeders são idempotentes (M-17): roda o `db:seed:all` três vezes e confere que nada falha nem duplica |
| `validar-volume-uploads.js` | Prova que as fotos sobrevivem à recriação do container (volume `uploads_data`) |
| `executar-no-docker.sh` | Comando do serviço `testes` do `docker-compose.test.yml`: seeders, ambiente e suíte |

Massa de dados:

| Arquivo | Conteúdo |
| --- | --- |
| [`src/seeders/test-fixtures.js`](../../src/seeders/test-fixtures.js) | Usuário dono da vitrine, usuário admin e **50 anúncios ativos** (CT-13). Só roda no banco de teste e não duplica se rodar de novo |
| [`tests/fixtures/arquivos.js`](../fixtures/arquivos.js) | PNG válido, JPEG de 6 MB e texto disfarçado de PNG, gerados em memória (CT-03, CT-08, CT-09) |
| [`tests/fixtures/dados.js`](../fixtures/dados.js) | `novoUsuario()` para os usuários A e B e `anuncioValido()` com os dados do CT-03 |

Categoria não é tabela (é uma lista fixa no código), então não tem fixture.

## Configuração (`.env`)

Copie o [`.env.example`](../../.env.example) para `.env`. Desde a Sprint 8 (M-11), **nenhuma senha fica escrita nos arquivos do Compose**: elas vêm do `.env`, e o Compose para com uma mensagem clara se faltar alguma.

| Variável | Obrigatória para | Observação |
| --- | --- | --- |
| `DB_PASSWORD` | `docker-compose.yml` e testes locais | No Docker, vira a senha do root do MySQL **só na primeira criação** do volume `mysql_data` |
| `DB_TEST_PASSWORD` | `docker-compose.test.yml` | Senha do MySQL descartável de teste; qualquer valor serve |
| `JWT_SECRET` | API | Valor longo e aleatório |
| `DB_PORTA_HOST` | — | Porta do MySQL do Docker na sua máquina (padrão `3306`). Use outra, ex. `3308`, se o MySQL do Windows já ocupa a 3306 |

Para gerar um valor aleatório: `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"`.

## Como usar (pasta `API/Back-End`)

**Com o MySQL da sua máquina** (usa `DB_HOST`, `DB_USER` e `DB_PASSWORD` do seu `.env`):

```bash
npm run test:db:preparar   # recria o banco de teste do zero
npm run test:ambiente      # confere se está tudo pronto
npm run test:evidencias    # roda a suíte com cobertura e grava as evidências
npm run test:seeders       # confere que os seeders são idempotentes
npm run test:db:limpar     # apaga o banco e os uploads de teste
```

**Tudo isolado no Docker** (não usa porta nem os volumes de desenvolvimento; o banco fica em memória e some no fim). Roda seeders, ambiente e a suíte com cobertura, e grava as evidências:

```bash
npm run test:docker
docker compose -f docker-compose.test.yml down
```

**Persistência das fotos no volume** (com o `docker-compose.yml` de desenvolvimento no ar):

```bash
npm run test:volume
```

## Configuração do Jest

Já está no `package.json` (Sprint 7). As dependências vêm do `yarn.lock` (o `Dockerfile` instala por ele): use `yarn install` e, para pacotes novos, `yarn add -D`.

```json
"jest": {
  "testEnvironment": "node",
  "setupFiles": ["<rootDir>/tests/ambiente/variaveis.js"],
  "globalSetup": "<rootDir>/tests/ambiente/globalSetup.js",
  "globalTeardown": "<rootDir>/tests/ambiente/globalTeardown.js",
  "testPathIgnorePatterns": ["/node_modules/", "/tests/ambiente/", "/tests/fixtures/"]
}
```

Coloque o ID do caso no nome do teste (ex.: `it("CT-01 login com senha correta devolve token", ...)`): é assim que o relatório agrupa os resultados por caso.

## Problemas conhecidos

- **`required variable DB_PASSWORD is missing a value`** (ou `DB_TEST_PASSWORD`): falta a variável no `.env`. Veja a seção de configuração.
- **API sem conseguir entrar no MySQL do Docker depois de mudar `DB_PASSWORD`:** o MySQL só usa a senha na primeira criação do volume `mysql_data`. Volte para a senha antiga ou recrie o volume com `docker compose down -v` (**apaga os dados de desenvolvimento**). Volumes criados antes da Sprint 8 usam a senha `root`.
- **API reiniciando com `Cannot find module 'multer'` no Docker:** o volume anônimo de `node_modules` guardou pacotes antigos. Recrie com `docker compose up -d --build --renew-anon-volumes`.
- **Porta 3306 ocupada** pelo MySQL instalado no Windows: defina `DB_PORTA_HOST=3308` (ou outra livre) no `.env`. O `docker-compose.test.yml` não usa porta nenhuma.
- **Docker Desktop não abre no Windows** (erro `remove ...\Docker\run\dockerInference` ou `...\docker-secrets-engine\engine.sock`): sobraram arquivos de socket de uma execução encerrada à força. Feche o Docker Desktop, renomeie a pasta citada no erro (ex.: `%LOCALAPPDATA%\Docker\run` → `run.old`) e abra de novo. **Não use "Reset to factory defaults"**: ele pode apagar imagens e volumes.
