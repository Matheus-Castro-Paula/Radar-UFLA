const ValidationHandler = require("./ValidationHandler");
const RegraNegocioError = require("../RegraNegocioError");

class CamposObrigatoriosHandler extends ValidationHandler {
  async validar(dados, contexto = {}) {
    // Valida campos obrigatórios apenas na criação de anúncios
    if (contexto.acao === "CRIAR") {
      const camposObrigatorios = [
        "titulo",
        "descricao",
        "tipo",
        "categoria",
        "local_encontro",
      ];
      const faltando = camposObrigatorios.filter((campo) => !dados[campo]);

      if (faltando.length > 0) {
        throw new RegraNegocioError(
          RegraNegocioError.CODIGOS.VALIDACAO,
          `Campos obrigatórios não informados: ${faltando.join(", ")}.`,
        );
      }
    }

    await super.validar(dados, contexto);
  }
}

module.exports = CamposObrigatoriosHandler;
