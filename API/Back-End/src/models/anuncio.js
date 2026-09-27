'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Anuncio extends Model {
    static associate(models) {
      // Cada anúncio pertence a um usuário
      Anuncio.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario',
      });
      // Um anúncio pode ter várias fotos
      Anuncio.hasMany(models.FotoAnuncio, {
        foreignKey: 'anuncio_id',
        as: 'fotos',
      });
      // Um anúncio pode receber vários comentários
      Anuncio.hasMany(models.Comentario, {
        foreignKey: 'anuncio_id',
        as: 'comentarios',
      });
    }
  }

  Anuncio.init(
    {
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      titulo: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      tipo: {
        type: DataTypes.ENUM('ACHADO', 'PERDIDO'),
        allowNull: false,
      },
      categoria: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      local_encontro: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('ATIVO', 'RESOLVIDO', 'ARQUIVADO'),
        allowNull: false,
        defaultValue: 'ATIVO',
      },
    },
    {
      sequelize,
      modelName: 'Anuncio',
      tableName: 'anuncio',
      underscored: true,
      createdAt: 'criado_em',
      updatedAt: 'atualizado_em',
    }
  );

  return Anuncio;
};