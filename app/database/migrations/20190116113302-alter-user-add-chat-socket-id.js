'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn(
          'Users',
          'socketId',
          Sequelize.STRING,
      );
  },

  down: (queryInterface) => {
      return queryInterface.removeColumn(
          'Users',
          'socketId',
      );
  }
};
