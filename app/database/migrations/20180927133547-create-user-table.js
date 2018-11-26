'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            username: {
                type: Sequelize.STRING
            },
            password: {
                type: Sequelize.STRING
            },
            personaAddress: {
                type: Sequelize.STRING
            },
            isActive: {
                type: Sequelize.BOOLEAN
            },
            isRegEmailSent: {
                type: Sequelize.BOOLEAN
            },
            userRoleId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
                references: {
                    model: "UserRoles",
                    key: 'id'
                },
            },
            contactInfoId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "ContactInfos",
                    key: 'id'
                }
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Users');
    }
};