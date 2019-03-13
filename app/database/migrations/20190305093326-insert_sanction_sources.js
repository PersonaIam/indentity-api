'use strict';
const {
  SANCTION_SOURCE_TYPES,
} = require('../../../config/constants');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { US_TREASURY, EU_TREASURY } = SANCTION_SOURCE_TYPES;
    const sanctionsListMigrationPromises = [];

    US_TREASURY.urls.forEach(url => {
      const createSanctionSourcePromise = queryInterface.bulkInsert('SanctionsSources', [
        {
          type: US_TREASURY.name,
          createdAt: new Date(),
          updatedAt: new Date(),
          url,
        },
      ]);

      sanctionsListMigrationPromises.push(createSanctionSourcePromise);
    });

    EU_TREASURY.urls.forEach(url => {
      const createSanctionSourcePromise = queryInterface.bulkInsert('SanctionsSources', [
        {
          type: EU_TREASURY.name,
          createdAt: new Date(),
          updatedAt: new Date(),
          url,
        },
      ]);

      sanctionsListMigrationPromises.push(createSanctionSourcePromise);
    });


    return Promise.all(sanctionsListMigrationPromises);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('SanctionsSources', {}, {});
  }
};
