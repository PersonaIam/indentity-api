'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
        'ContactInfos',
        'email',
        {
          type: Sequelize.STRING,
          unique: true,
        },
    );
  },

  down: (queryInterface) => {
    return queryInterface.changeColumn(
        'ContactInfos',
        'email',
        {
          type: Sequelize.STRING,
          unique: false,
        },
    );
  }
};
