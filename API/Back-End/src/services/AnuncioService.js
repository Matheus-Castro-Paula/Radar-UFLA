const { sequelize, Anuncio, FotoAnuncio, Usuario } = require("../models");
const RegraNegocioError = require("./RegraNegocioError");
const anuncioValidationChain = require("./validations/AnuncioValidationChain");
const MidiaStorage = require("./MidiaStorage");

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

  async criar(dados, usuarioId, arquivos = []) {
    // 1. Corrente de validação. Os arquivos seguem em memória: nada vai ao disco se alguma regra falhar.
    await anuncioValidationChain.executar(dados, { acao: "CRIAR", arquivos });

    const categoria = String(dados.categoria).trim().toLowerCase();

    // 2. Grava os arquivos (só depois de validados).
    const fotosSalvas = await MidiaStorage.salvar(arquivos);

    // 3. Persistência. Se o banco falhar, os arquivos recém-gravados são removidos.
    let anuncioId;
    try {
      anuncioId = await sequelize.transaction(async (transaction) => {
        const anuncio = await Anuncio.create(
          {
            usuario_id: usuarioId,
            titulo: dados.titulo,
            descricao: dados.descricao,
            tipo: dados.tipo,
            categoria,
            local_encontro: dados.local_encontro,
            data_ocorrencia: dados.data_ocorrencia
              ? new Date(dados.data_ocorrencia)
              : null,
            status: "ATIVO",
          },
          { transaction },
        );

        if (fotosSalvas.length > 0) {
          await FotoAnuncio.bulkCreate(
            fotosSalvas.map((foto) => ({ anuncio_id: anuncio.id, ...foto })),
            { transaction },
          );
        }
        return anuncio.id;
      });
    } catch (erro) {
      await MidiaStorage.remover(fotosSalvas.map((foto) => foto.url_imagem));
      throw erro;
    }

    return this.buscarPorId(anuncioId);
  },

  async atualizar(id, dados, usuarioId) {
    const anuncio = await buscarAnuncioDoAutor(id, usuarioId);

    const substituiFotos = dados.fotos !== undefined;
    const urlsAtuais = anuncio.fotos.map((foto) => foto.url_imagem);
    const fotosFinais = substituiFotos ? dados.fotos : urlsAtuais;
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

    // M-16 / M-13: a edição não recebe arquivos, então a lista de fotos só pode
    // manter ou remover as que já são deste anúncio. Isso impede apontar para a
    // foto de outro anúncio (e, depois, apagar o arquivo dele).
    if (substituiFotos && fotosFinais.some((url) => !urlsAtuais.includes(url))) {
      throw new RegraNegocioError(
        RegraNegocioError.CODIGOS.VALIDACAO,
        "Na edição só é possível manter ou remover as fotos já publicadas neste anúncio.",
      );
    }

    const camposEditaveis = [
      "titulo",
      "descricao",
      "tipo",
      "categoria",
      "local_encontro",
      "data_ocorrencia",
      "status",
    ];
    const alteracoes = {};
    for (const campo of camposEditaveis) {
      if (dados[campo] !== undefined) alteracoes[campo] = dados[campo];
    }
    if (novaCategoria !== undefined) alteracoes.categoria = novaCategoria;

    // M-13: fotos que saem do anúncio perdem a linha e o arquivo. As que ficam
    // não são recriadas, então mime_type e tamanho_bytes continuam gravados.
    const fotosRemovidas = substituiFotos
      ? anuncio.fotos.filter((foto) => !fotosFinais.includes(foto.url_imagem))
      : [];

    await sequelize.transaction(async (transaction) => {
      await anuncio.update(alteracoes, { transaction });
      if (fotosRemovidas.length > 0) {
        await FotoAnuncio.destroy({
          where: { id: fotosRemovidas.map((foto) => foto.id) },
          transaction,
        });
      }
    });

    // Só apaga do disco depois que o banco confirmou
    await MidiaStorage.remover(fotosRemovidas.map((foto) => foto.url_imagem));

    return this.buscarPorId(id);
  },

  async excluir(id, usuarioId) {
    const anuncio = await buscarAnuncioDoAutor(id, usuarioId);
    const urlsDasFotos = anuncio.fotos.map((foto) => foto.url_imagem);
    // ON DELETE CASCADE remove fotos e comentários associados
    await anuncio.destroy();
    // M-13: o arquivo não pode ficar órfão no volume /uploads
    await MidiaStorage.remover(urlsDasFotos);
  },
};