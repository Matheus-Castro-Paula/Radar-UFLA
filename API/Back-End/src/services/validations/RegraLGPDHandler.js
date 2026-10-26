const ValidationHandler = require("./ValidationHandler");
const RegraNegocioError = require("../RegraNegocioError");

class RegraLGPDHandler extends ValidationHandler {
  async validar(dados, contexto = {}) {
    const categoria = String(dados.categoria || "")
      .trim()
      .toLowerCase();
    const fotos = dados.fotos || [];
    const ehDocumento = categoria === "documento";
    const temFotos = Array.isArray(fotos) && fotos.length > 0;

    if (ehDocumento && temFotos) {
      throw new RegraNegocioError(
        RegraNegocioError.CODIGOS.LGPD,
        "Não é permitido enviar foto de documento pessoal (RN-04 / LGPD). Publique apenas a descrição.",
      );
    }

    await super.validar(dados, contexto);
  }
}

module.exports = RegraLGPDHandler;
