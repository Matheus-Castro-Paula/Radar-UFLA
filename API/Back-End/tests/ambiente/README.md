# Ambiente de testes — banco, fixtures, Docker e evidências

Sprint 7 — responsável: `@Artxisto`. Base: seção 4 de [`plano-de-testes.md`](../../../../docs/testes/plano-de-testes.md).

## O que tem aqui

| Arquivo | Função |
| --- | --- |
| `variaveis.js` | Define `NODE_ENV=test`, a pasta temporária `UPLOADS_DIR` e um `JWT_SECRET` aleatório só para o teste |
| `banco.js` | Recria o `radar_ufla_test`, aplica as migrations do zero, roda os seeders e zera a pasta de uploads. **Recusa** qualquer banco cujo nome não termine em `_test` |
| `globalSetup.js` / `globalTeardown.js` | Ganchos do Jest: preparam o ambiente antes da suíte e apagam os uploads depois |
| `verificar.js` | Confere o ambiente (migrations, fixtures, pasta de uploads, segredo) |
| `gerar-evidencias.js` | Roda o Jest e grava o log e um relatório por caso `CT-xx` em `docs/testes/evidencias/` |
| `validar-volume-uploads.js` | Prova que as fotos sobrevivem à recriação do container (volume `uploads_data`) |
| `executar-no-docker.sh` | Comando do serviço `testes` do `docker-compose.test.yml` |

Massa de dados:

| Arquivo | Conteúdo |
| --- | --- |
| [`src/seeders/test-fixtures.js`](../../src/seeders/test-fixtures.js) | Usuário dono da vitrine, usuário admin e **50 anúncios ativos** (CT-13). Só roda no banco de teste |
| [`tests/fixtures/arquivos.js`](../fixtures/arquivos.js) | PNG válido, JPEG de 6 MB e texto disfarçado de PNG, gerados em memória (CT-03, CT-08, CT-09) |
| [`tests/fixtures/dados.js`](../fixtures/dados.js) | `novoUsuario()` para os usuários A e B e `anuncioValido()` com os dados do CT-03 |

Categoria não é tabela (é uma lista fixa no código), então não tem fixture.

## Como usar (pasta `API/Back-End`)

**Com o MySQL da sua máquina** (usa `DB_HOST`, `DB_USER` e `DB_PASSWORD` do seu `.env`):

```bash
npm run test:db:preparar   # recria o banco de teste do zero
npm run test:ambiente      # confere se está tudo pronto
npm run test:evidencias    # roda a suíte e grava as evidências
npm run test:db:limpar     # apaga o banco e os uploads de teste
```

**Tudo isolado no Docker** (não usa a porta 3306 nem os volumes de desenvolvimento; o banco fica em memória e some no fim):

```bash
npm run test:docker
docker compose -f docker-compose.test.yml down
```

**Persistência das fotos no volume** (com o `docker-compose.yml` de desenvolvimento no ar):

```bash
npm run test:volume
```

## Para ligar a suíte do Jest neste ambiente

Ao instalar o Jest e o Supertest, use `yarn add -D jest supertest`: o `Dockerfile` instala pelo `yarn.lock`. Depois, aponte a configuração do Jest para estes arquivos:

```json
"jest": {
  "testEnvironment": "node",
  "setupFiles": ["<rootDir>/tests/ambiente/variaveis.js"],
  "globalSetup": "<rootDir>/tests/ambiente/globalSetup.js",
  "globalTeardown": "<rootDir>/tests/ambiente/globalTeardown.js",
  "testPathIgnorePatterns": ["/node_modules/", "/tests/ambiente/", "/tests/fixtures/"]
}
```

Coloque o ID do caso no nome do teste (ex.: `test("CT-01 login com senha correta devolve token", ...)`): é assim que o relatório agrupa os resultados por caso.

## Problemas conhecidos

- **API reiniciando com `Cannot find module 'multer'` no Docker:** o volume anônimo de `node_modules` guardou pacotes antigos. Recrie com `docker compose up -d --build --renew-anon-volumes`.
- **Porta 3306 ocupada** pelo MySQL instalado no Windows: o `docker-compose.test.yml` não usa porta nenhuma. Para o `docker-compose.yml` de desenvolvimento, pare o MySQL local ou use um arquivo de override só na sua máquina.
