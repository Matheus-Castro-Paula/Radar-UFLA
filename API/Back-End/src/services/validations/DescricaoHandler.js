const ValidationHandler = require("./ValidationHandler");
const RegraNegocioError = require("../RegraNegocioError");

const LIMITE_DESCRICAO = 200;

class DescricaoHandler extends ValidationHandler {
  async validar(dados, contexto = {}) {
    const validaDescricao =
      contexto.acao === "CRIAR" ||
      (contexto.acao === "ATUALIZAR" &&
        Array.isArray(contexto.camposAlterados) &&
        contexto.camposAlterados.includes("descricao"));

    if (validaDescricao && dados.descricao !== undefined && dados.descricao !== null) {
      if (typeof dados.descricao !== "string") {
        throw new RegraNegocioError(
          RegraNegocioError.CODIGOS.VALIDACAO,
          "A descrição deve ser um texto.",
        );
      }
      // Array.from conta caracteres e não unidades UTF-16 (emoji conta como 1)
      const tamanho = Array.from(dados.descricao.trim()).length;
      if (tamanho > LIMITE_DESCRICAO) {
        throw new RegraNegocioError(
          RegraNegocioError.CODIGOS.VALIDACAO,
          `A descrição deve ter no máximo ${LIMITE_DESCRICAO} caracteres (recebido: ${tamanho}).`,
        );
      }
    }

    await super.validar(dados, contexto);
  }
}

DescricaoHandler.LIMITE_DESCRICAO = LIMITE_DESCRICAO;

module.exports = DescricaoHandler;