'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeConstraint('Referrals', 'Referrals_userId_fkey'),

            queryInterface.removeConstraint('Invitations', 'Invitations_referralId_fkey'),

            queryInterface.removeConstraint('Invitations', 'Invitations_userId_fkey'),

            queryInterface.addConstraint('Referrals', ['userId'], {
                type: 'foreign key',
                name: 'Referrals_userId_fkey',
                references: {
                    table: 'Users',
                    field: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'cascade',
            }),

            queryInterface.addConstraint('Invitations', ['referralId'], {
                type: 'foreign key',
                name: 'Invitations_referralId_fkey',
                references: {
                    table: 'Referrals',
                    field: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'cascade',
            }),

            queryInterface.addConstraint('Invitations', ['userId'], {
                type: 'foreign key',
                name: 'Invitations_userId_fkey',
                references: {
                    table: 'Users',
                    field: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'cascade',
            }),
        ]);
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.dropTable('users');
        */
    }
};
