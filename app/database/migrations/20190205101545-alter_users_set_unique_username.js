'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn(
            'Users',
            'username',
            {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
        );
    },

    down: (queryInterface) => {
        return queryInterface.changeColumn(
            'Users',
            'username',
            {
                type: Sequelize.STRING,
                unique: false,
                allowNull: true,
            },
        );
    }
};
