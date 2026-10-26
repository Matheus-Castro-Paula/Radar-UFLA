const ValidationHandler = require("./ValidationHandler");
const RegraNegocioError = require("../RegraNegocioError");

const MAX_FOTOS = 3;
const EXTENSOES_FOTO = /\.(jpe?g|png|webp)$/i;

class FotosHandler extends ValidationHandler {
  async validar(dados, contexto = {}) {
    const fotos = dados.fotos;

    if (fotos !== undefined) {
      if (!Array.isArray(fotos)) {
        throw new RegraNegocioError(
          RegraNegocioError.CODIGOS.VALIDACAO,
          "O campo fotos deve ser uma lista de URLs.",
        );
      }

      if (fotos.length > MAX_FOTOS) {
        throw new RegraNegocioError(
          RegraNegocioError.CODIGOS.VALIDACAO,
          `Envie no máximo ${MAX_FOTOS} fotos.`,
        );
      }

      const invalida = fotos.find(
        (url) => typeof url !== "string" || !EXTENSOES_FOTO.test(url),
      );

      if (invalida !== undefined) {
        throw new RegraNegocioError(
          RegraNegocioError.CODIGOS.VALIDACAO,
          "Fotos devem ser JPG, PNG ou WEBP.",
        );
      }
    }

    await super.validar(dados, contexto);
  }
}

module.exports = FotosHandler;
