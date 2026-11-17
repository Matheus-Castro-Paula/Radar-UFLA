const ValidationHandler = require("./ValidationHandler");
const RegraNegocioError = require("../RegraNegocioError");

// Tolerância para diferença de relógio entre navegador e servidor
const TOLERANCIA_MS = 5 * 60 * 1000;

class DataOcorrenciaHandler extends ValidationHandler {
  async validar(dados, contexto = {}) {
    const valor = dados.data_ocorrencia;

    if (valor !== undefined && valor !== null) {
      const data = new Date(valor);

      if (Number.isNaN(data.getTime())) {
        throw new RegraNegocioError(
          RegraNegocioError.CODIGOS.VALIDACAO,
          "Data e hora da ocorrência inválidas.",
        );
      }
      if (data.getTime() > Date.now() + TOLERANCIA_MS) {
        throw new RegraNegocioError(
          RegraNegocioError.CODIGOS.VALIDACAO,
          "A data e a hora da ocorrência não podem estar no futuro.",
        );
      }
    }

    await super.validar(dados, contexto); 
  }
}

module.exports = DataOcorrenciaHandler;