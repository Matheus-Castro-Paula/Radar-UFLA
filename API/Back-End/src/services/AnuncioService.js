const { sequelize, Anuncio, FotoAnuncio, Usuario } = require("../models");
const RegraNegocioError = require("./RegraNegocioError");
const anuncioValidationChain = require("./validations/AnuncioValidationChain");

const CATEGORIA_DOCUMENTO = "documento";

// RN-04: a vitrine pública nunca expõe e-mail nem telefone do autor
const INCLUDE_PUBLICO = [
  { model: FotoAnuncio, as: "fotos", attributes: ["id", "url_imagem"] },
  { model: Usuario, as: "usuario", attributes: ["id", "nome"] },
];

async function buscarAnuncioDoAutor(id, usuarioId) {
  const anuncio = await Anuncio.findByPk(id, {
    include: [{ model: FotoAnuncio, as: "fotos" }],
  });
  if (!anuncio) {
    throw new RegraNegocioError(
      RegraNegocioError.CODIGOS.NAO_ENCONTRADO,
      "Anúncio não encontrado.",
    );
  }
  if (anuncio.usuario_id !== usuarioId) {
    throw new RegraNegocioError(
      RegraNegocioError.CODIGOS.PROIBIDO,
      "Apenas o autor pode alterar este anúncio.",
    );
  }
  return anuncio;
}

module.exports = {
  CATEGORIA_DOCUMENTO,

  async listar({ tipo } = {}) {
    const where = { status: "ATIVO" };
    if (tipo) {
      // Executa a corrente para validar o parâmetro de busca
      await anuncioValidationChain.executar({ tipo }, { acao: "LISTAR" });
      where.tipo = tipo;
    }
    return Anuncio.findAll({
      where,
      include: INCLUDE_PUBLICO,
      order: [["criado_em", "DESC"]],
    });
  },

  async buscarPorId(id) {
    const anuncio = await Anuncio.findByPk(id, { include: INCLUDE_PUBLICO });
    if (!anuncio) {
      throw new RegraNegocioError(
        RegraNegocioError.CODIGOS.NAO_ENCONTRADO,
        "Anúncio não encontrado.",
      );
    }
    return anuncio;
  },

  async criar(dados, usuarioId) {
    // 1. Delega TODAS as validações para a corrente (Chain of Responsibility)
    await anuncioValidationChain.executar(dados, { acao: "CRIAR" });

    const fotos = dados.fotos || [];
    const categoria = String(dados.categoria).trim().toLowerCase();

    // 2. Persistência
    const anuncioId = await sequelize.transaction(async (transaction) => {
      const anuncio = await Anuncio.create(
        {
          usuario_id: usuarioId,
          titulo: dados.titulo,
          descricao: dados.descricao,
          tipo: dados.tipo,
          categoria,
          local_encontro: dados.local_encontro,
          status: "ATIVO",
        },
        { transaction },
      );

      if (fotos.length > 0) {
        await FotoAnuncio.bulkCreate(
          fotos.map((url_imagem) => ({ anuncio_id: anuncio.id, url_imagem })),
          { transaction },
        );
      }
      return anuncio.id;
    });

    return this.buscarPorId(anuncioId);
  },

  async atualizar(id, dados, usuarioId) {
    const anuncio = await buscarAnuncioDoAutor(id, usuarioId);

    const substituiFotos = dados.fotos !== undefined;
    const fotosFinais = substituiFotos
      ? dados.fotos
      : anuncio.fotos.map((foto) => foto.url_imagem);
    const novaCategoria =
      dados.categoria !== undefined
        ? String(dados.categoria).trim().toLowerCase()
        : undefined;
    const categoriaFinal = novaCategoria ?? anuncio.categoria;

    // Monta o estado final consolidado para passar pela corrente de validações
    const estadoFinal = {
      ...anuncio.toJSON(),
      ...dados,
      categoria: categoriaFinal,
      fotos: fotosFinais,
    };

    // Delega a validação do estado final para a corrente
    await anuncioValidationChain.executar(estadoFinal, { acao: "ATUALIZAR" });

    const camposEditaveis = [
      "titulo",
      "descricao",
      "tipo",
      "categoria",
      "local_encontro",
      "status",
    ];
    const alteracoes = {};
    for (const campo of camposEditaveis) {
      if (dados[campo] !== undefined) alteracoes[campo] = dados[campo];
    }
    if (novaCategoria !== undefined) alteracoes.categoria = novaCategoria;

    await sequelize.transaction(async (transaction) => {
      await anuncio.update(alteracoes, { transaction });
      if (substituiFotos) {
        await FotoAnuncio.destroy({ where: { anuncio_id: id }, transaction });
        if (fotosFinais.length > 0) {
          await FotoAnuncio.bulkCreate(
            fotosFinais.map((url_imagem) => ({
              anuncio_id: anuncio.id,
              url_imagem,
            })),
            { transaction },
          );
        }
      }
    });

    return this.buscarPorId(id);
  },

  async excluir(id, usuarioId) {
    const anuncio = await buscarAnuncioDoAutor(id, usuarioId);
    // ON DELETE CASCADE remove fotos e comentários associados
    await anuncio.destroy();
  },
};
