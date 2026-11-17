// Confere se o ambiente de teste está pronto para a suíte (rodar depois de
// "banco.js preparar"). Com --evidencia, grava o resultado em docs/testes/evidencias/.
require("./variaveis");

const fs = require("fs/promises");
const path = require("path");
const { Sequelize } = require("sequelize");
const { test: config } = require("../../src/config/config");
const { FIXTURES } = require("../../src/seeders/test-fixtures");
const { carimbo, gravar, tabela } = require("./evidencia");

const MIGRATIONS_DIR = path.resolve(__dirname, "../../src/migrations");

async function verificar() {
  const sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config,
    logging: false,
  });
  const checagens = [];
  const checar = (item, esperado, obtido, ok = String(esperado) === String(obtido)) =>
    checagens.push({ item, esperado, obtido, ok });
  const contar = async (sql, replacements) =>
    Number((await sequelize.query(sql, { replacements }))[0][0].n);

  try {
    await sequelize.authenticate();
    checar("Conexão com o banco de teste", config.database, sequelize.config.database);

    const migrations = (await fs.readdir(MIGRATIONS_DIR)).filter((f) => f.endsWith(".js")).length;
    checar("Migrations aplicadas", migrations, await contar('SELECT COUNT(*) n FROM `SequelizeMeta`'));

    const emails = [FIXTURES.autorVitrine.email, FIXTURES.admin.email];
    checar("Usuários de fixture", emails.length, await contar("SELECT COUNT(*) n FROM usuarios WHERE email IN (?)", [emails]));
    checar(
      "Fixture admin com tipo_usuario = admin",
      1,
      await contar("SELECT COUNT(*) n FROM usuarios WHERE email = ? AND tipo_usuario = 'admin'", [FIXTURES.admin.email]),
    );
    checar(
      "Anúncios ativos para o CT-13",
      FIXTURES.totalAnunciosVitrine,
      await contar("SELECT COUNT(*) n FROM anuncio WHERE status = 'ATIVO'"),
    );
    checar("Fotos no banco (deve começar vazio)", 0, await contar("SELECT COUNT(*) n FROM foto_anuncio"));
  } catch (erro) {
    checar("Acesso ao banco de teste", "sem erro", erro.message, false);
  } finally {
    await sequelize.close();
  }

  // Pasta de uploads isolada e com permissão de escrita
  const dir = process.env.UPLOADS_DIR;
  try {
    const sonda = path.join(dir, ".sonda");
    await fs.writeFile(sonda, "ok");
    await fs.rm(sonda);
    const sobrando = (await fs.readdir(dir)).length;
    checar("Pasta de uploads de teste gravável e vazia", "0 arquivos", `${sobrando} arquivos`);
  } catch (erro) {
    checar("Pasta de uploads de teste gravável e vazia", "gravável", erro.message, false);
  }

  checar("JWT_SECRET próprio do teste definido", "sim", process.env.JWT_SECRET ? "sim" : "não");

  return checagens;
}

async function main() {
  const checagens = await verificar();
  const linhas = checagens.map((c) => [c.ok ? "✅" : "❌", c.item, c.esperado, c.obtido]);
  console.table(checagens.map(({ ok, item, esperado, obtido }) => ({ ok: ok ? "sim" : "NÃO", item, esperado, obtido })));
  const tudoOk = checagens.every((c) => c.ok);

  if (process.argv.includes("--evidencia")) {
    const agora = new Date();
    const md = [
      "# Evidência — Ambiente de banco de testes",
      "",
      `- **Data:** ${agora.toISOString()}`,
      `- **Banco:** \`${config.database}\` em \`${config.host}:${config.port}\``,
      `- **Pasta de uploads:** \`${process.env.UPLOADS_DIR}\``,
      `- **Node:** ${process.version}`,
      `- **Resultado:** ${tudoOk ? "✅ ambiente pronto" : "❌ ambiente com problemas"}`,
      "",
      tabela(["", "Verificação", "Esperado", "Obtido"], linhas),
      "",
      "Gerado por `tests/ambiente/verificar.js --evidencia`, depois de `tests/ambiente/banco.js preparar`.",
      "",
    ].join("\n");
    console.log(`>> Evidência: ${await gravar(`${carimbo(agora)}_ambiente-de-teste.md`, md)}`);
  }

  process.exit(tudoOk ? 0 : 1);
}

main();
