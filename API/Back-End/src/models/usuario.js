'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // Um usuário pode criar vários anúncios
      Usuario.hasMany(models.Anuncio, {
        foreignKey: 'usuario_id',
        as: 'anuncios',
      });
      // Um usuário pode escrever vários comentários
      Usuario.hasMany(models.Comentario, {
        foreignKey: 'usuario_id',
        as: 'comentarios',
      });
    }
  }

  Usuario.init(
    {
      nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      senha_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      reset_password_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      reset_password_expires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Usuario',
      tableName: 'usuarios',
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Usuario;
};