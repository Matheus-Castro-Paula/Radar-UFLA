// Jest "globalTeardown": roda uma vez depois de toda a suíte.
// Apaga a pasta temporária de uploads. O banco fica, para inspecionar falhas;
// ele é recriado do zero na próxima execução.
const { limpar } = require("./banco");

module.exports = async () => {
  await limpar({ apagarBanco: false });
};
