'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comentario extends Model {
    static associate(models) {
      // Cada comentário pertence a um anúncio
      Comentario.belongsTo(models.Anuncio, {
        foreignKey: 'anuncio_id',
        as: 'anuncio',
      });
      // Cada comentário pertence a um usuário (autor)
      Comentario.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'autor',
      });
    }
  }

  Comentario.init(
    {
      anuncio_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      conteudo: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Comentario',
      tableName: 'comentario',
      underscored: true,
      createdAt: 'criado_em',
      updatedAt: false,
    }
  );

  return Comentario;
};