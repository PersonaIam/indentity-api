'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'ConversationMembers',
            'lastSeenOn',
            {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('now'),
            }
        );
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn(
            'ConversationMembers',
            'lastSeenOn',
        );
    },
};
