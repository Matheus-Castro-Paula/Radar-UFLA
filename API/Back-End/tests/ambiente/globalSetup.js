// Jest "globalSetup": roda uma vez antes de toda a suíte.
// Parte sempre de banco vazio (plano de testes, seção 4).
const { preparar } = require("./banco");

module.exports = async () => {
  await preparar({ silencioso: true });
};
