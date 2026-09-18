'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('anuncio', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
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
      titulo: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      tipo: {
        type: Sequelize.ENUM('ACHADO', 'PERDIDO'),
        allowNull: false,
      },
      categoria: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      local_encontro: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('ATIVO', 'RESOLVIDO', 'ARQUIVADO'),
        allowNull: false,
        defaultValue: 'ATIVO',
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: 'CURRENT_TIMESTAMP',
      },
    }, {
      engine: 'InnoDB',
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    });

    await queryInterface.addIndex('anuncio', ['usuario_id'], {
      name: 'idx_anuncio_usuario_id',
    });
    await queryInterface.addIndex('anuncio', ['tipo', 'status'], {
      name: 'idx_anuncio_tipo_status',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('anuncio');
  },
};
