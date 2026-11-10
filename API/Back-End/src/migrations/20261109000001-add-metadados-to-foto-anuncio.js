'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('foto_anuncio', 'mime_type', {
      type: Sequelize.STRING(50),
      allowNull: true,
      after: 'url_imagem',
    });
    await queryInterface.addColumn('foto_anuncio', 'tamanho_bytes', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'mime_type',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('foto_anuncio', 'tamanho_bytes');
    await queryInterface.removeColumn('foto_anuncio', 'mime_type');
  },
};