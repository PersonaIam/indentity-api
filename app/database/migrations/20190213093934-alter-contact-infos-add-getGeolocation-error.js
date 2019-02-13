'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'ContactInfos',
        'getGeolocationError',
        Sequelize.STRING,
    );
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn(
        'ContactInfos',
        'getGeolocationError',
    );
  }
};
