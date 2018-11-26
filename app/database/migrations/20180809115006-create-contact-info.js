'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('ContactInfos', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            firstName: {
                type: Sequelize.STRING
            },
            lastName: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            phoneNumber: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING
            },
            city: {
                type: Sequelize.STRING
            },
            zipCode: {
                type: Sequelize.STRING
            },
            countryId: {
                type: Sequelize.INTEGER,
                foreignKey: true,
                references: {
                    model: "Countries",
                    key: "id"
                }
            },
            lat: {
                type: Sequelize.STRING
            },
            lng: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('now')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('now')
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('ContactInfos');
    }
};