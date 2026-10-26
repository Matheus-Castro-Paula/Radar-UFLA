const ValidationHandler = require("./ValidationHandler");
const RegraNegocioError = require("../RegraNegocioError");

const CATEGORIAS = ["objeto", "eletronico", "documento", "material", "outro"];
const TIPOS = ["ACHADO", "PERDIDO"];
const STATUS = ["ATIVO", "RESOLVIDO", "ARQUIVADO"];

class CategoriaEStatusHandler extends ValidationHandler {
  async validar(dados, contexto = {}) {
    if (dados.tipo !== undefined && !TIPOS.includes(dados.tipo)) {
      throw new RegraNegocioError(
        RegraNegocioError.CODIGOS.VALIDACAO,
        `Tipo deve ser ${TIPOS.join(" ou ")}.`,
      );
    }

    if (dados.status !== undefined && !STATUS.includes(dados.status)) {
      throw new RegraNegocioError(
        RegraNegocioError.CODIGOS.VALIDACAO,
        `Status deve ser ${STATUS.join(", ")}.`,
      );
    }

    if (dados.categoria !== undefined) {
      const categoria = String(dados.categoria).trim().toLowerCase();
      if (!CATEGORIAS.includes(categoria)) {
        throw new RegraNegocioError(
          RegraNegocioError.CODIGOS.VALIDACAO,
          `Categoria inválida. Use uma de: ${CATEGORIAS.join(", ")}.`,
        );
      }
    }

    await super.validar(dados, contexto);
  }
}

module.exports = CategoriaEStatusHandler;
