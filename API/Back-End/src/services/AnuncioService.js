const { sequelize, Anuncio, FotoAnuncio, Usuario } = require("../models");
const RegraNegocioError = require("./RegraNegocioError");

const { VALIDACAO, LGPD, NAO_ENCONTRADO, PROIBIDO } = RegraNegocioError.CODIGOS;

// Mesmo valor usado no <select name="categoria"> de publicar.html
const CATEGORIA_DOCUMENTO = "documento";
const TIPOS = ["ACHADO", "PERDIDO"];
const STATUS = ["ATIVO", "RESOLVIDO", "ARQUIVADO"];
const CAMPOS_OBRIGATORIOS = [
  "titulo",
  "descricao",
  "tipo",
  "categoria",
  "local_encontro",
];

// RF-08: até 3 fotos, formatos JPG/PNG/WEBP
const MAX_FOTOS = 3;
const EXTENSOES_FOTO = /\.(jpe?g|png|webp)$/i;

// RN-04: a vitrine pública nunca expõe e-mail nem telefone do autor
const INCLUDE_PUBLICO = [
  { model: FotoAnuncio, as: "fotos", attributes: ["id", "url_imagem"] },
  { model: Usuario, as: "usuario", attributes: ["id", "nome"] },
];

function validarCamposObrigatorios(dados) {
  const faltando = CAMPOS_OBRIGATORIOS.filter((campo) => !dados[campo]);
  if (faltando.length) {
    throw new RegraNegocioError(
      VALIDACAO,
      `Campos obrigatórios não informados: ${faltando.join(", ")}.`,
    );
  }
}

function validarTipoEStatus({ tipo, status }) {
  if (tipo !== undefined && !TIPOS.includes(tipo)) {
    throw new RegraNegocioError(VALIDACAO, `Tipo deve ser ${TIPOS.join(" ou ")}.`);
  }
  if (status !== undefined && !STATUS.includes(status)) {
    throw new RegraNegocioError(VALIDACAO, `Status deve ser ${STATUS.join(", ")}.`);
  }
}

// RN-04 (LGPD): anúncio da categoria "documento" não pode ter foto.
// Recebe o estado FINAL do anúncio (após aplicar a edição), para que a
// mesma regra sirva tanto na criação quanto na edição.
function validarRegraLGPD(categoria, fotos) {
  const ehDocumento =
    String(categoria).trim().toLowerCase() === CATEGORIA_DOCUMENTO;
  const temFotos = Array.isArray(fotos) && fotos.length > 0;

  if (ehDocumento && temFotos) {
    throw new RegraNegocioError(
      LGPD,
      "Não é permitido enviar foto de documento pessoal (RN-04 / LGPD). Publique apenas a descrição.",
    );
  }
}

function validarFotos(fotos) {
  if (!Array.isArray(fotos)) {
    throw new RegraNegocioError(VALIDACAO, "O campo fotos deve ser uma lista de URLs.");
  }
  if (fotos.length > MAX_FOTOS) {
    throw new RegraNegocioError(VALIDACAO, `Envie no máximo ${MAX_FOTOS} fotos.`);
  }
  const invalida = fotos.find(
    (url) => typeof url !== "string" || !EXTENSOES_FOTO.test(url),
  );
  if (invalida !== undefined) {
    throw new RegraNegocioError(VALIDACAO, "Fotos devem ser JPG, PNG ou WEBP.");
  }
}

async function buscarAnuncioDoAutor(id, usuarioId) {
  const anuncio = await Anuncio.findByPk(id, {
    include: [{ model: FotoAnuncio, as: "fotos" }],
  });
  if (!anuncio) {
    throw new RegraNegocioError(NAO_ENCONTRADO, "Anúncio não encontrado.");
  }
  if (anuncio.usuario_id !== usuarioId) {
    throw new RegraNegocioError(PROIBIDO, "Apenas o autor pode alterar este anúncio.");
  }
  return anuncio;
}

module.exports = {
  CATEGORIA_DOCUMENTO,

  async listar({ tipo } = {}) {
    const where = { status: "ATIVO" };
    if (tipo) {
      validarTipoEStatus({ tipo });
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
      throw new RegraNegocioError(NAO_ENCONTRADO, "Anúncio não encontrado.");
    }
    return anuncio;
  },

  async criar(dados, usuarioId) {
    const fotos = dados.fotos || [];

    // Ordem do diagrama 2.3: obrigatórios → RN-04 → regras de foto → persistência
    validarCamposObrigatorios(dados);
    validarTipoEStatus(dados);
    validarRegraLGPD(dados.categoria, fotos);
    validarFotos(fotos);

    const anuncioId = await sequelize.transaction(async (transaction) => {
      const anuncio = await Anuncio.create(
        {
          usuario_id: usuarioId,
          titulo: dados.titulo,
          descricao: dados.descricao,
          tipo: dados.tipo,
          categoria: dados.categoria,
          local_encontro: dados.local_encontro,
          status: "ATIVO",
        },
        { transaction },
      );
      await FotoAnuncio.bulkCreate(
        fotos.map((url_imagem) => ({ anuncio_id: anuncio.id, url_imagem })),
        { transaction },
      );
      return anuncio.id;
    });

    return this.buscarPorId(anuncioId);
  },

  async atualizar(id, dados, usuarioId) {
    const anuncio = await buscarAnuncioDoAutor(id, usuarioId);

    // Se "fotos" vier no corpo, substitui todas; senão mantém as atuais
    const substituiFotos = dados.fotos !== undefined;
    const fotosFinais = substituiFotos
      ? dados.fotos
      : anuncio.fotos.map((foto) => foto.url_imagem);
    const categoriaFinal = dados.categoria ?? anuncio.categoria;

    validarTipoEStatus(dados);
    validarRegraLGPD(categoriaFinal, fotosFinais);
    if (substituiFotos) validarFotos(fotosFinais);

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

    await sequelize.transaction(async (transaction) => {
      await anuncio.update(alteracoes, { transaction });
      if (substituiFotos) {
        await FotoAnuncio.destroy({ where: { anuncio_id: id }, transaction });
        await FotoAnuncio.bulkCreate(
          fotosFinais.map((url_imagem) => ({ anuncio_id: anuncio.id, url_imagem })),
          { transaction },
        );
      }
    });

    return this.buscarPorId(id);
  },

  async excluir(id, usuarioId) {
    const anuncio = await buscarAnuncioDoAutor(id, usuarioId);
    // ON DELETE CASCADE remove fotos e comentários
    await anuncio.destroy();
  },
};
