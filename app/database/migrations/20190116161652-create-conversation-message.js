'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('ConversationMessages', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            conversationId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Conversations",
                    key: 'id'
                },
            },
            // author of the message
            conversationMemberId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "ConversationMembers",
                    key: 'id'
                },
            },
            message: {
                type: Sequelize.STRING
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
        return queryInterface.dropTable('ConversationMessages');
    }
};