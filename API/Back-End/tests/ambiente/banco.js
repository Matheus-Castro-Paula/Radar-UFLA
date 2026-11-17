// Rotina de limpeza e população do banco de teste (Sprint 7).
//
// Uso pela linha de comando:
//   node tests/ambiente/banco.js preparar   → recria o banco, migrations, seeders e uploads
//   node tests/ambiente/banco.js limpar     → apaga o banco de teste e a pasta de uploads
// Uso pelo Jest: globalSetup.js e globalTeardown.js chamam estas funções.
require("./variaveis");

const fs = require("fs/promises");
const path = require("path");
const { spawnSync } = require("child_process");
const mysql = require("mysql2/promise");
const { test: config } = require("../../src/config/config");

const RAIZ = path.resolve(__dirname, "../..");
const SEQUELIZE_CLI = require.resolve("sequelize-cli/lib/sequelize");

// Este script apaga um banco inteiro: só aceita o banco de teste.
function garantirBancoDeTeste() {
  if (process.env.NODE_ENV !== "test" || !/^[A-Za-z0-9_]+_test$/.test(config.database)) {
    throw new Error(
      `Recusado: "${config.database}" não parece um banco de teste (o nome deve terminar em _test).`,
    );
  }
}

async function conectarServidor() {
  return mysql.createConnection({
    host: config.host,
    port: Number(config.port),
    user: config.username,
    password: config.password,
  });
}

async function recriarBanco() {
  const conexao = await conectarServidor();
  try {
    await conexao.query(`DROP DATABASE IF EXISTS \`${config.database}\``);
    await conexao.query(
      `CREATE DATABASE \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
  } finally {
    await conexao.end();
  }
}

function sequelizeCli(...args) {
  const resultado = spawnSync(process.execPath, [SEQUELIZE_CLI, ...args, "--env", "test"], {
    cwd: RAIZ,
    env: process.env,
    encoding: "utf8",
  });
  const saida = `${resultado.stdout || ""}${resultado.stderr || ""}`;
  if (resultado.status !== 0) {
    throw new Error(`sequelize-cli ${args.join(" ")} falhou:\n${saida}`);
  }
  return saida;
}

async function recriarUploads() {
  await fs.rm(process.env.UPLOADS_DIR, { recursive: true, force: true });
  await fs.mkdir(process.env.UPLOADS_DIR, { recursive: true });
}

async function preparar({ silencioso = false } = {}) {
  garantirBancoDeTeste();
  const log = (msg) => !silencioso && console.log(msg);

  log(`>> Recriando o banco ${config.database} em ${config.host}:${config.port}...`);
  await recriarBanco();
  log(">> Aplicando migrations...");
  log(sequelizeCli("db:migrate").trim());
  log(">> Aplicando seeders (demonstração + fixtures de teste)...");
  log(sequelizeCli("db:seed:all").trim());
  log(`>> Pasta de uploads de teste: ${process.env.UPLOADS_DIR}`);
  await recriarUploads();
  log(">> Ambiente de teste pronto.");
}

async function limpar({ apagarBanco = true } = {}) {
  garantirBancoDeTeste();
  await fs.rm(process.env.UPLOADS_DIR, { recursive: true, force: true });
  if (apagarBanco) {
    const conexao = await conectarServidor();
    try {
      await conexao.query(`DROP DATABASE IF EXISTS \`${config.database}\``);
    } finally {
      await conexao.end();
    }
  }
}

module.exports = { preparar, limpar };

if (require.main === module) {
  const comando = process.argv[2];
  const acoes = { preparar: () => preparar(), limpar: () => limpar() };
  if (!acoes[comando]) {
    console.error("Uso: node tests/ambiente/banco.js <preparar|limpar>");
    process.exit(1);
  }
  acoes[comando]()
    .then(() => comando === "limpar" && console.log(">> Banco e uploads de teste removidos."))
    .catch((erro) => {
      console.error(erro.message);
      process.exit(1);
    });
}
