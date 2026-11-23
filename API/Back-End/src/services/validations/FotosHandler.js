const ValidationHandler = require("./ValidationHandler");
const RegraNegocioError = require("../RegraNegocioError");
const { MAX_FOTOS, MAX_BYTES, MIMES_PERMITIDOS } = require("../../config/upload");
const { ehUrlLocal } = require("../MidiaStorage");

function conteudoCombinaComMime(buffer, mime) {
  if (!Buffer.isBuffer(buffer)) return false;
  if (mime === "image/jpeg") {
    return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mime === "image/png") {
    return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (mime === "image/webp") {
    return (
      buffer.length >= 12 &&
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }
  return false;
}

class FotosHandler extends ValidationHandler {
  async validar(dados, contexto = {}) {
    const fotos = dados.fotos;
    const arquivos = contexto.arquivos || [];

    if (contexto.acao === "CRIAR" && fotos !== undefined) {
      throw new RegraNegocioError(
        RegraNegocioError.CODIGOS.VALIDACAO,
        'No cadastro, envie as fotos como arquivos (multipart/form-data, campo "fotos"). URLs não são aceitas.',
      );
    }

    // Aqui só chega a edição (PUT), onde a lista serve para manter ou remover fotos.
    if (fotos !== undefined) {
      if (!Array.isArray(fotos)) {
        throw new RegraNegocioError(
          RegraNegocioError.CODIGOS.VALIDACAO,
          "O campo fotos deve ser uma lista de caminhos de fotos já publicadas.",
        );
      }

      if (fotos.length > MAX_FOTOS) {
        throw new RegraNegocioError(
          RegraNegocioError.CODIGOS.VALIDACAO,
          `Envie no máximo ${MAX_FOTOS} fotos.`,
        );
      }

      // M-16: na edição só vale caminho local gerado pela API (/uploads/<uuid>.<ext>).
      // URL externa, caminho com "../" ou nome arbitrário são recusados.
      const invalida = fotos.find((url) => !ehUrlLocal(url));

      if (invalida !== undefined) {
        throw new RegraNegocioError(
          RegraNegocioError.CODIGOS.VALIDACAO,
          "Na edição, as fotos devem ser caminhos locais em /uploads/ de fotos já publicadas. URLs externas não são aceitas.",
        );
      }
    }

    // 2. Arquivos enviados por multipart (RF-08)
    if (arquivos.length > 0) {
      const totalUrls = Array.isArray(fotos) ? fotos.length : 0;
      if (totalUrls + arquivos.length > MAX_FOTOS) {
        throw new RegraNegocioError(
          RegraNegocioError.CODIGOS.VALIDACAO,
          `Envie no máximo ${MAX_FOTOS} fotos.`,
        );
      }

      for (const arquivo of arquivos) {
        if (!Object.hasOwn(MIMES_PERMITIDOS, arquivo.mimetype)) {
          throw new RegraNegocioError(
            RegraNegocioError.CODIGOS.VALIDACAO,
            "Fotos devem ser JPG, PNG ou WEBP.",
          );
        }
        if (arquivo.size > MAX_BYTES) {
          throw new RegraNegocioError(
            RegraNegocioError.CODIGOS.VALIDACAO,
            `Cada foto deve ter no máximo ${MAX_BYTES / (1024 * 1024)} MB.`,
          );
        }
        if (!conteudoCombinaComMime(arquivo.buffer, arquivo.mimetype)) {
          throw new RegraNegocioError(
            RegraNegocioError.CODIGOS.VALIDACAO,
            "O arquivo enviado não é uma imagem válida.",
          );
        }
      }
    }

    await super.validar(dados, contexto);
  }
}

module.exports = FotosHandler;