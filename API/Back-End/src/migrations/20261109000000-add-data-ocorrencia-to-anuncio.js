'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('anuncio', 'data_ocorrencia', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'local_encontro',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('anuncio', 'data_ocorrencia');
  },
};