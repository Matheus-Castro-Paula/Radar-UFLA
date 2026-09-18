'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comentario', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      anuncio_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'anuncio',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      conteudo: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      engine: 'InnoDB',
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    });

    await queryInterface.addIndex('comentario', ['anuncio_id'], {
      name: 'idx_comentario_anuncio_id',
    });
    await queryInterface.addIndex('comentario', ['usuario_id'], {
      name: 'idx_comentario_usuario_id',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('comentario');
  },
};
