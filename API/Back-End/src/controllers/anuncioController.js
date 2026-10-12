const AnuncioService = require("../services/AnuncioService");
const RegraNegocioError = require("../services/RegraNegocioError");

const { VALIDACAO, LGPD, NAO_ENCONTRADO, PROIBIDO } = RegraNegocioError.CODIGOS;

// Tradução dos erros de negócio do service para status HTTP
// (RN-04 responde 400, conforme critério de aceitação da Issue #25)
const STATUS_POR_CODIGO = {
  [VALIDACAO]: 400,
  [LGPD]: 400,
  [PROIBIDO]: 403,
  [NAO_ENCONTRADO]: 404,
};

function responderErro(res, error, mensagemPadrao) {
  if (error instanceof RegraNegocioError) {
    return res.status(STATUS_POR_CODIGO[error.codigo]).json({ error: error.message });
  }
  return res.status(500).json({ error: mensagemPadrao, details: error.message });
}

module.exports = {
  async listar(req, res) {
    try {
      const anuncios = await AnuncioService.listar({ tipo: req.query.tipo });
      return res.status(200).json(anuncios);
    } catch (error) {
      return responderErro(res, error, "Erro ao listar anúncios.");
    }
  },

  async buscarPorId(req, res) {
    try {
      const anuncio = await AnuncioService.buscarPorId(req.params.id);
      return res.status(200).json(anuncio);
    } catch (error) {
      return responderErro(res, error, "Erro ao buscar anúncio.");
    }
  },

  async criar(req, res) {
    try {
      const anuncio = await AnuncioService.criar(req.body, req.usuarioId);
      return res.status(201).json({ message: "Anúncio criado com sucesso!", anuncio });
    } catch (error) {
      return responderErro(res, error, "Erro ao criar anúncio.");
    }
  },

  async atualizar(req, res) {
    try {
      const anuncio = await AnuncioService.atualizar(
        req.params.id,
        req.body,
        req.usuarioId,
      );
      return res.status(200).json({ message: "Anúncio atualizado com sucesso!", anuncio });
    } catch (error) {
      return responderErro(res, error, "Erro ao atualizar anúncio.");
    }
  },

  async excluir(req, res) {
    try {
      await AnuncioService.excluir(req.params.id, req.usuarioId);
      return res.status(204).send();
    } catch (error) {
      return responderErro(res, error, "Erro ao excluir anúncio.");
    }
  },
};
