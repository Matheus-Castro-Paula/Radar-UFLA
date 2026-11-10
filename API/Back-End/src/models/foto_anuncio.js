'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FotoAnuncio extends Model {
    static associate(models) {
      // Cada foto pertence a um único anúncio
      FotoAnuncio.belongsTo(models.Anuncio, {
        foreignKey: 'anuncio_id',
        as: 'anuncio',
      });
    }
  }

  FotoAnuncio.init(
    {
      anuncio_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Caminho relativo da mídia, ex.: /uploads/1731170000-garrafa.jpg (ADR-08)
      url_imagem: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      mime_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      tamanho_bytes: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      // Sugestão de melhoria (RN-04): permite ocultar fotos de documentos
      // sensíveis na vitrine pública. Requer nova migration para existir de fato.
      // contem_dado_sensivel: {
      //   type: DataTypes.BOOLEAN,
      //   allowNull: false,
      //   defaultValue: false,
      // },
    },
    {
      sequelize,
      modelName: 'FotoAnuncio',
      tableName: 'foto_anuncio',
      underscored: true,
      createdAt: 'criado_em',
      updatedAt: false,
    }
  );

  return FotoAnuncio;
};