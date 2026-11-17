const fs = require("fs");
const request = require("supertest");
const app = require("../src/server");
const { sequelize, Usuario } = require("../src/models");
const { UPLOADS_DIR } = require("../src/config/upload");
const { Op } = require("sequelize");

const TELEFONE = "35999990000";

// Buffers mínimos com a assinatura (magic bytes) que o FotosHandler confere
const JPEG = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(64, 1)]);
const PNG = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  Buffer.alloc(64, 1),
]);

const ANUNCIO_BASE = {
  titulo: "Garrafa azul",
  descricao: "Garrafa térmica azul achada na biblioteca",
  tipo: "ACHADO",
  categoria: "objeto",
  local_encontro: "Biblioteca",
};

const DOMINIO = "@jest.ufla.br";

async function limparBanco() {
  if (!sequelize.config.database.endsWith("_test")) {
    throw new Error(`Banco "${sequelize.config.database}" não parece ser de teste.`);
  }
  // ON DELETE CASCADE remove anúncios e fotos desses usuários
  await Usuario.destroy({ where: { email: { [Op.like]: `%${DOMINIO}` } } });
}

function limparUploads() {
  fs.rmSync(UPLOADS_DIR, { recursive: true, force: true });
}

function listarUploads() {
  return fs.existsSync(UPLOADS_DIR) ? fs.readdirSync(UPLOADS_DIR) : [];
}

async function criarUsuarioLogado(apelido) {
  const email = `${apelido}${DOMINIO}`;
  const senha = "senha123";
  await request(app)
    .post("/api/auth/registro")
    .send({ nome: `Usuário ${apelido}`, email, senha, telefone: TELEFONE });
  const login = await request(app).post("/api/auth/login").send({ email, senha });
  return { token: login.body.token, usuario: login.body.usuario, email, senha };
}

// Publica via multipart/form-data, como o front-end faz
function publicar(token, { campos = {}, fotos = [] } = {}) {
  const req = request(app).post("/api/anuncios").set("Authorization", `Bearer ${token}`);
  for (const [chave, valor] of Object.entries({ ...ANUNCIO_BASE, ...campos })) {
    for (const v of [].concat(valor)) req.field(chave, v);
  }
  for (const f of fotos) {
    req.attach("fotos", f.buffer, { filename: f.nome, contentType: f.tipo });
  }
  return req;
}

// Data sem milissegundos (o DATETIME do MySQL não guarda) e sempre no passado
function horasAtras(horas) {
  return new Date(Math.floor((Date.now() - horas * 3600 * 1000) / 1000) * 1000).toISOString();
}

module.exports = {
  app, TELEFONE, JPEG, PNG, ANUNCIO_BASE,
  limparBanco, limparUploads, listarUploads, criarUsuarioLogado, publicar, horasAtras, DOMINIO,
};