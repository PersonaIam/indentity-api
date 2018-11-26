'use strict';

const admin = {
    username: 'YWRtaW4=',
    password: 'dGVzdA==',
    personaAddress: 'Tk9fTkVFRF9GT1JfQUREUkVTUw==',
    isActive: true,
    isRegEmailSent: true,
    userRoleId: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
};

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [
            admin,
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', { username: [ admin.username ]}, {})
    }
};