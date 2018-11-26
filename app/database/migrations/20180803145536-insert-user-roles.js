'use strict';
const { USER_ROLES } = require('../../../config/constants');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('UserRoles', [
        {
            name: USER_ROLES.IDENTITY_USER,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: USER_ROLES.NOTARY,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: USER_ROLES.PROVIDER,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: USER_ROLES.SYS_ADMIN,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ]);
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('UserRoles', { name: [
          "IDENTITY_USER",
          "NOTARY",
          "PROVIDER",
          "SYS_ADMIN",
      ]}, {})
  }
};