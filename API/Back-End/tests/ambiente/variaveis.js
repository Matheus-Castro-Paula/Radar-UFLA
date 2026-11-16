// Variáveis do ambiente de teste (plano de testes, seção 4).
// Carregado ANTES da API: no Jest, via "setupFiles"; nos scripts, no topo.
const os = require("os");
const path = require("path");
const crypto = require("crypto");

process.env.NODE_ENV = "test";

// Pasta temporária de uploads, separada da pasta real (apagada no fim da suíte)
process.env.UPLOADS_DIR =
  process.env.UPLOADS_DIR || path.join(os.tmpdir(), "radar-ufla-uploads-teste");

// Segredo próprio do teste, gerado na hora: nenhum segredo fica no código
// (boundaries.md, regra 5) e ele nunca coincide com o de desenvolvimento.
process.env.JWT_SECRET =
  process.env.JWT_SECRET_TEST || crypto.randomBytes(32).toString("hex");
