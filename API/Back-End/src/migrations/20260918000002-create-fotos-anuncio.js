'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('foto_anuncio', {
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
      url_imagem: {
        type: Sequelize.STRING(255),
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

    await queryInterface.addIndex('foto_anuncio', ['anuncio_id'], {
      name: 'idx_foto_anuncio_id',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('foto_anuncio');
  },
};
