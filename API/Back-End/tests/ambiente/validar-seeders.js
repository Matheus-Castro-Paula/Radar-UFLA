// M-17: confere que os seeders são idempotentes. Prepara o banco de teste do
// zero (seeders rodam 1x), roda o db:seed:all mais duas vezes e confere que
// nada falhou nem duplicou. Grava a evidência em docs/testes/evidencias/.
//
// Uso: node tests/ambiente/validar-seeders.js
require("./variaveis");

const path = require("path");
const { spawnSync } = require("child_process");
const { Sequelize } = require("sequelize");
const { test: config } = require("../../src/config/config");
const { FIXTURES } = require("../../src/seeders/test-fixtures");
const { preparar } = require("./banco");
const { carimbo, gravar, tabela } = require("./evidencia");

const RAIZ = path.resolve(__dirname, "../..");

function seedAll() {
  const r = spawnSync(
    process.execPath,
    [require.resolve("sequelize-cli/lib/sequelize"), "db:seed:all", "--env", "test"],
    { cwd: RAIZ, env: process.env, encoding: "utf8" },
  );
  const avisos = `${r.stdout}${r.stderr}`
    .split("\n")
    .filter((l) => /nada a fazer|ERROR/.test(l))
    .map((l) => l.trim());
  return { codigo: r.status, avisos };
}

async function contar() {
  const s = new Sequelize(config.database, config.username, config.password, { ...config, logging: false });
  try {
    const n = async (sql, rep) => Number((await s.query(sql, { replacements: rep }))[0][0].n);
    return {
      admin: await n("SELECT COUNT(*) n FROM usuarios WHERE email = ?", ["admin@ufla.br"]),
      usuariosFixture: await n("SELECT COUNT(*) n FROM usuarios WHERE email IN (?)", [
        [FIXTURES.autorVitrine.email, FIXTURES.admin.email],
      ]),
      anuncios: await n("SELECT COUNT(*) n FROM anuncio"),
    };
  } finally {
    await s.close();
  }
}

async function main() {
  const inicio = new Date();
  await preparar({ silencioso: true });
  const antes = await contar();

  const execucoes = [seedAll(), seedAll()];
  const depois = await contar();

  const linhas = [
    ["Seeders na preparação (1ª vez)", "—", `admin ${antes.admin}, fixtures ${antes.usuariosFixture}, anúncios ${antes.anuncios}`, "✅"],
    ...execucoes.map((e, i) => [
      `db:seed:all de novo (${i + 2}ª vez)`,
      `código ${e.codigo}`,
      e.avisos.join(" / ") || "—",
      e.codigo === 0 ? "✅" : "❌",
    ]),
    [
      "Contagem final igual à inicial",
      "—",
      `admin ${depois.admin}, fixtures ${depois.usuariosFixture}, anúncios ${depois.anuncios}`,
      JSON.stringify(antes) === JSON.stringify(depois) ? "✅" : "❌",
    ],
  ];
  linhas.forEach((l) => console.log(`${l[3]} ${l[0]} — ${l[2]}`));
  const tudoOk = linhas.every((l) => l[3] === "✅");

  const md = [
    "# Evidência — Seeders idempotentes (M-17)",
    "",
    `- **Data:** ${inicio.toISOString()}`,
    `- **Banco:** \`${config.database}\` em \`${config.host}:${config.port}\``,
    "- **O que prova:** rodar os seeders várias vezes não falha nem duplica registros. Antes da correção, o seeder de demonstração tentava recriar `admin@ufla.br`, o e-mail único falhava (`SequelizeUniqueConstraintError`) e o `docker-entrypoint.sh` derrubava a API.",
    `- **Resultado:** ${tudoOk ? "✅ seeders idempotentes" : "❌ falhou"}`,
    "",
    tabela(["Execução", "Saída", "Detalhe", ""], linhas),
    "",
    "Gerado por `tests/ambiente/validar-seeders.js`.",
    "",
  ].join("\n");
  console.log(`>> Evidência: ${await gravar(`${carimbo(inicio)}_seeders-idempotentes.md`, md)}`);
  process.exit(tudoOk ? 0 : 1);
}

main().catch((erro) => {
  console.error(erro.message);
  process.exit(1);
});
